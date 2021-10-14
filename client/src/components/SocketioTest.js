// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import Chat from './Chat';

// const socket = io.connect('http://localhost:8080');

// function SocketioTest() {
//   const [username, setUsername] = useState('');
//   const [zone, setZone] = useState('');
//   const [showChat, setShowChat] = useState(false);

//   const joinSpace = () => {
//     socket.emit('join_zone', zone);
//   };

//   return (
//     <div>
//       <h1>Socket IO testing</h1>
//       <h3>Join Chat</h3>
//       <input
//         type="text"
//         placeholder="Username"
//         onChange={(change) => setUsername(change.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Chat Zone ID"
//         onChange={(change) => setZone(change.target.value)}
//       />
//       <button onClick={joinZone}>Join</button>
//       <Chat socket={socket} username={username} zone={zone} />
//     </div>
//   );
// }

// export default SocketioTest;
