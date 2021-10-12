const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
global.jwt = require('jsonwebtoken');
global.pgp = require('pg-promise')();
const app = express();
const authenticate = require('./middlewares/auth');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;
global.db = pgp(`${process.env.DATABASE}`);

const port = process.env.PORT;
const db = pgp(`${process.env.DATABASE}`);

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
  const spaceName = req.body.spaceName;
  console.log(userName, spaceName);

  db.any('SELECT space_id from spaces where space_name = $1', [spaceName]).then(
    (space) => {
      console.log(space);
      const spaceID = space[0].space_id;
      db.any('SELECT user_id from users where username = $1', [userName]).then(
        (user) => {
          console.log(user);
          const userID = user[0].user_id;
          db.none(
            'INSERT INTO spaces_invitees (space_id, user_id) VALUES($1, $2)',
            [spaceID, userID]
          ).then(
            res.send(
              `User ID: ${userID} has been invited to Space: ${spaceName}`
            )
          );
        }
      );
    }
  );
});

// possible method to secure space urls
app.get('/test', (req, res) => {
  const mySpace = 15;
  db.any(
    'SELECT space_id, user_id from spaces where user_id=$1 group by space_id',
    [9]
  ).then((foundSpaces) => {
    console.log(foundSpaces);
    const mappedSpaces = foundSpaces.map((space) => {
      return space.space_id;
    });
    console.log(mappedSpaces);
    if (mappedSpaces.includes(mySpace)) {
      console.log('User is authenticated in Space');
    } else {
      console.log('User does not belong here');
    }
    res.send({ success: true });
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
