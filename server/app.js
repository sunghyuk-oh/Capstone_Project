require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcryptjs');
global.jwt = require('jsonwebtoken');
global.pgp = require('pg-promise')();
const authenticate = require('./middlewares/auth');
const port = process.env.PORT;
global.db = pgp(`${process.env.DATABASE}`);

const { urlencoded } = require('express');
const { Server } = require('socket.io');

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

const port = process.env.PORT;
const db = pgp(`${process.env.DATABASE}`);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} Connected`);

  socket.on('join_zone', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined zone: ${data}`);
  });

  socket.on('send_msg', (data) => {
    console.log(data);
    socket.to(data.zone).emit('receive_msg', data);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} Disconnected`);
  });
});

app.get('/', (req, res) => {
  res.send({ message: 'server is running on 8080' });
});

app.post('/register', (req, res) => {
  const { firstName, lastName, email, username, password, confirmPassword } =
    req.body;

  if (password !== confirmPassword) {
    res.json({
      success: false,
      message: 'The passwords are not matched. Please try again.'
    });
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  db.any('SELECT username, password FROM users WHERE username = $1', [username])
    .then((user) => {
      if (user.length > 0) {
        res.json({
          success: false,
          message: 'Username already existed. Please try again.'
        });
      } else {
        db.none(
          'INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5);',
          [username, hash, firstName, lastName, email]
        )
          .then(() =>
            res.json({
              success: true,
              message: 'You have been successfully registered. Please Login.'
            })
          )
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.any('SELECT user_id, username, password FROM users WHERE username = $1', [
    username
  ])
    .then((foundUser) => {
      if (foundUser.length > 0) {
        const userID = foundUser[0].user_id;
        bcrypt.compare(password, foundUser[0].password, function (err, result) {
          if (result) {
            const token = jwt.sign(
              { username: username, userID: userID },
              `${process.env.JWT_SECRET_KEY}`
            );

            res.json({
              success: true,
              token: token,
              username: username,
              userID: userID
            });
          } else {
            res.json({
              success: false,
              message: 'Password is incorrect. Please try again.'
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: 'Username does not exist. Please try again.'
        });
      }
    })
    .catch((err) => console.error(err));
});

app.post('/createSpace', (req, res) => {
  const { spaceName, userID } = req.body;
  db.none('INSERT INTO spaces (space_name, user_id) VALUES ($1, $2)', [
    spaceName,
    userID
  ])
    .then(() => {
      db.any('SELECT space_id FROM spaces where space_name = $1', [
        spaceName
      ]).then((space) => {
        res.json({
          success: true,
          message: 'The new space has been created!',
          spaceID: space[0].space_id
        });
      });
    })
    .catch((err) => console.log(err));
});

// Invite logic - server route works good

app.post('/invite', (req, res) => {
  const userName = req.body.userName;
  const spaceID = req.body.spaceID;
  console.log(userName, spaceID);

  db.any('SELECT space_name from spaces where space_id = $1', [spaceID]).then(
    (space) => {
      // console.log(space);
      const spaceName = space[0].space_name;
      db.any('SELECT user_id from users where username = $1', [userName]).then(
        (user) => {
          // console.log(user);
          const userID = user[0].user_id;
          db.none(
            'INSERT INTO spaces_invitees (space_id, user_id) VALUES($1, $2)',
            [spaceID, userID]
          ).then(
            res.json({
              success: true,
              message: `User ID: ${userID} has been invited to Space: ${spaceName}`
            })
          );
        }
      );
    }
  );
});

// authenticate space
app.get('/auth/:spaceid', (req, res) => {
  const spaceID = req.params.spaceID;
  const userID = req.body.userID;

  db.any('SELECT space_id from spaces where user_id=$1 group by space_id', [
    userID
  ]).then((userSpacesCreated) => {
    const createdSpaces = userSpacesCreated.map((space) => {
      return space.space_id;
    });
    db.any(
      'SELECT space_id from spaces_invitees where user_id=$1 group by space_id',
      [userID]
    ).then((userSpacesInvited) => {
      const invitedSpaces = userSpacesInvited.map((space) => {
        return space.space_id;
      });
      const allSpaces = createdSpaces.concat(invitedSpaces);
      // console.log(allSpaces);
      if (allSpaces.includes(spaceID)) {
        res.json({ success: true, message: 'User is authenticated in Space' });
      } else {
        res.redirect('http://localhost:3000/');
      }
    });
  });
});

app.get('/viewSpace/:userID', authenticate, (req, res) => {
  const { userID } = req.params;

  db.any(
    'SELECT space_id, space_name, user_id from spaces where user_id = $1 group by space_id',
    [userID]
  ).then((foundSpaces) => {
    res.json(foundSpaces);
  });
});

app.listen(port, () => console.log('Server is running...'));
