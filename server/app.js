require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pgp = require('pg-promise')();
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

  db.any('SELECT username, password FROM users WHERE username = $1', [username])
    .then((foundUser) => {
      if (foundUser.length > 0) {
        bcrypt.compare(password, foundUser[0].password, function (err, result) {
          if (result) {
            const token = jwt.sign(
              { username: username },
              `${process.env.JWT_SECRET_KEY}`
            );

            res.json({ success: true, token: token });
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

server.listen(port, () => console.log(`Server is running on port ${port}...`));

// socket.io testing

// const socket = require('socket.io');

// const io = socket(server);

// io.on('connection', (socket) => {
//   console.log(socket.id);

//   socket.on('chat_room', (data) => {
//     socket.join(data);
//     console.log('User just messaged ' + data);
//   });

//   socket.on('disconnect', () => {
//     console.log('USER DISCONNECTED');
//   });
// });
