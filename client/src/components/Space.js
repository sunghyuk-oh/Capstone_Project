import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
// import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const socket = io.connect('http://localhost:8080');

function Space(props) {
  // const location = useLocation();
  // const spaceName = location.state.spaceName;
  const spaceID = useParams().spaceid;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    joinSpace();
  }, [props]);

  const joinSpace = () => {
    socket.emit('join_space', spaceID);
  };

  const handleUsernameInput = (e) => {
    setUserName(e.target.value);
  };

  const handleInviteSubmit = () => {
    fetch('http://localhost:8080/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: userName, spaceID: spaceID })
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <header>
        <nav>
          <span>logo</span>
          <button>User Account</button>
        </nav>
      </header>
      <main>
        <section>Create Space</section>
        <section>Space List</section>
        <section>
          <span>List Members</span>
          <div>
            <span>User Invite</span>
            <input
              type="text"
              placeholder="Enter Invitee's Username"
              name="usernameInput"
              onChange={handleUsernameInput}
            />
            <button onClick={handleInviteSubmit}>Invite</button>
          </div>
        </section>
        <section>Post List</section>
        <section>
          <span>Chat</span>
          <Chat
            socket={socket}
            username={localStorage.username}
            spaceID={spaceID}
          />
        </section>
        <section>Event List</section>
      </main>
    </div>
  );
}

export default Space;
