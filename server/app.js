require('dotenv').config();
global.express = require('express');
global.bcrypt = require('bcryptjs');
global.jwt = require('jsonwebtoken');
global.pgp = require('pg-promise')();
global.db = pgp(`${process.env.DATABASE}`);
global.authenticate = require('./middlewares/auth');
global.nodemailer = require('nodemailer');
const port = process.env.PORT;
const cors = require('cors');
const { urlencoded } = require('express');

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
const eventsRouter = require('./routers/events');
const accountsRouter = require('./routers/accounts');
const postsRouter = require('./routers/posts');

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// set routers
app.use('/users', usersRouter);
app.use('/spaces', spacesRouter);
app.use('/events', eventsRouter);
app.use('/accounts', accountsRouter);
app.use('/posts', postsRouter);

io.on('connection', (socket) => {
  console.log(`User ${socket.id} Connected`);
  server.getConnections(function (error, count) {
    console.log(`Number of server connections: ${count}`);
  });

  socket.on('join_space', (data) => {
    socket.join(data);
    console.log(
      `SocketID: ${socket.id} | Username: ${data.username} joined space: ${data.spaceName} - ${data.spaceID}`
    );
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
