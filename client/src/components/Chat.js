import React, { useEffect, useState } from 'react';

const Chat = ({ socket, username, spaceID }) => {
  const [currentMsg, setCurrentMsg] = useState('');
  const [msgList, setMsgList] = useState([]);

  const sendMsg = async () => {
    if (currentMsg !== '') {
      const msgData = {
        space: spaceID,
        author: username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes()
      };

      await socket.emit('send_msg', msgData);
      setMsgList((list) => [...list, msgData]);
    }
  };

  useEffect(() => {
    socket.on('receive_msg', (data) => {
      setMsgList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <section id="chatBox">
      <header>
        <p>Live Chat</p>
      </header>
      <main id="chatWindow">
        {msgList.map((msgContent, index) => {
          return (
            <div
              key={index}
              className="msg"
              id={username === msgContent.username ? 'self' : 'otherUser'}
            >
              {/* you can edit message colors and shapes based on above */}
              <div>
                <div className="msgContent">
                  <p>{msgContent.message}</p>
                </div>
                <div className="msgInfo">
                  <p>{msgContent.time}</p>
                  <p>{msgContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <footer>
        <input
          type="text"
          placeholder="Enter Your Message"
          onChange={(change) => {
            setCurrentMsg(change.target.value);
          }}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMsg();
          }}
        />
        <button onClick={sendMsg}>Send</button>
      </footer>
    </section>
  );
};

export default Chat;
