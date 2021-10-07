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

app.listen(port, () => console.log('Server is running...'))
