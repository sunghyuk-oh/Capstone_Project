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
      setCurrentMsg('');
    }
  };

  useEffect(() => {
    socket.on('receive_msg', (data) => {
      setMsgList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <section id="chatBox">
      <main id="chatWindow">
        {msgList.map((msgContent, index) => {
          return (
            <div
              key={index}
              className={
                username === msgContent.author ? 'myMsg' : 'otherUserMsg'
              }
            >
              <div className="msgContent">
                <p>{msgContent.message}</p>
              </div>
              <div className="msgInfo">
                <span className="author">{msgContent.author}</span>
                <span className="time">{msgContent.time}</span>
              </div>
            </div>
          );
        })}
      </main>
      <footer>
        <input
          type="text"
          placeholder="Enter Your Message"
          value={currentMsg}
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
