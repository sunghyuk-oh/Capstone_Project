import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux'

function Space(props) {
  const location = useLocation();
  const spaceName = location.state.spaceName;
  const [userName, setUserName] = useState('');

  const handleUsernameInput = (e) => {
    setUserName(e.target.value);
  };

  const handleInviteSubmit = () => {
    fetch('http://localhost:8080/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: userName, spaceName: spaceName })
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
        <section>Chat Box</section>
        <section>Event List</section>
      </main>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space);
