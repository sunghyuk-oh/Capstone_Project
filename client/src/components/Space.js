import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux'

function Space(props) {
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const spaceName = location.state.spaceName;
  console.log(spaceName);

  const handleUsernameInput = (e) => {
    setUserName(e.target.value);
  };

  const handleInviteSubmit = () => {
    fetch('http://localhost:8080/invite', {
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spaceName: spaceName, userName: userName })
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
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
              onChange={handleUsernameInput}
            />
            <button onClick={handleInviteSubmit}>Invite</button>
          </div>
        </section>
        <section>Post List</section>
        <section>Chat Box</section>
        <section>Event List</section>
      </main>
    </div>
  );
}

export default connect()(Space);
