const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const pgp = require('pg-promise')()
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors())

const port = process.env.PORT
const db = pgp(`${process.env.DATABASE}`)


app.post('/register', (req, res) => {
    const { firstName, lastName, email, username, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        res.json({success: false, message: 'The passwords are not matched. Please try again.'})
    }

    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)

    db.any('SELECT username, password FROM users WHERE username = $1', [username])
    .then((user) => {
        if (user.length > 0) {
            res.json({success: false, message: "Username already existed. Please try again."})            
        } else {
            db.none("INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5);", [username, hash, firstName, lastName, email])
            .then(() => res.json({success: true, message: "You have been successfully registered. Please Login."}))
            .catch(err => console.error(err))
        }
    })
    .catch(err => console.error(err))
})


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
              )
  
              res.json({
                success: true,
                token: token,
                username: username,
                userID: userID
              })
            } else {
              res.json({
                  success: false, 
                  message: 'Password is incorrect. Please try again.'
              })
            }
          })
        } else {
          res.json({
            success: false,
            message: 'Username does not exist. Please try again.'
          })
        }
      })
      .catch((err) => console.error(err));
})


app.post('/createSpace', (req, res) => {
    const { spaceName, userID } = req.body

    db.none('INSERT INTO spaces (space_name, user_id) VALUES ($1, $2)', [spaceName, userID])
    .then(res.json({success: true, message: "The new space has been created!"}))
    .catch(err => console.log(err))
    
})


app.listen(port, () => console.log('Server is running...'))
