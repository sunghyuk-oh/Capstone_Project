import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Space(props) {
  // const location = useLocation();
  // const spaceName = location.state.spaceName;
  const [userName, setUserName] = useState('');
  const [members, setMembers] = useState([])
  const spaceID = useParams().spaceid;
  const userID = localStorage.getItem('userID');

  useEffect(() => {
    authSpaceUsers()
    displaySpaceMembers()
  }, [])

  const authSpaceUsers = () => {
    fetch(`http://localhost:8080/auth/${spaceID}/${userID}`)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        console.log(result.message)
      } else {
        props.history.push('/')
        console.log(result.message)
      }
    })
    .catch(err => console.log(err))
  }

  const displaySpaceMembers = () => {
    fetch(`http://localhost:8080/displayMembers/${spaceID}`)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        setMembers(result.members)
      }
    })
    .catch(err => console.log(err))
  }

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

  const allMembers = members.map((member, index) => {
    return(
      <div key={index} className="">
        <h5>- {member.first_name} {member.last_name}</h5>
      </div>
    )
  })

  return (
    <div>
      <header>
        <nav>
          <span>{spaceID}</span>
          <span>logo</span>
          <button>User Account</button>
        </nav>
      </header>
      <main>
        <section>Create Space</section>
        <section>Space List</section>
        <section>
          <span>List Members</span>
          {allMembers}
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

export default Space;