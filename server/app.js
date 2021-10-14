require('dotenv').config();
const cors = require('cors');
global.bcrypt = require('bcryptjs');
global.jwt = require('jsonwebtoken');
global.pgp = require('pg-promise')();
const port = process.env.PORT;
global.db = pgp(`${process.env.DATABASE}`);
global.authenticate = require('./middlewares/auth');
const { urlencoded } = require('express');

global.express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// router variables
const usersRouter = require('./routers/users');
const spacesRouter = require('./routers/spaces');

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// set routers
app.use('/users', usersRouter);
app.use('/spaces', spacesRouter);

io.on('connection', (socket) => {
  console.log(`User ${socket.id} Connected`);

  socket.on('join_space', (data) => {
    socket.join(data);
    console.log(`User: ${socket.id} joined space: ${data}`);
  });

  socket.on('send_msg', (data) => {
    console.log(data);
    socket.to(data.space).emit('receive_msg', data);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} Disconnected`);
  });
});

app.get('/', (req, res) => {
  res.send({ message: `Server is running on PORT: ${port}` });
});

server.listen(port, () => console.log('Server is running...'));
