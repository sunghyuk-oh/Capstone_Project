import { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

function Main(props) {
  const history = useHistory();
  const [newSpace, setNewSpace] = useState(false);
  const [spaceName, setSpaceName] = useState('');

  const handleNewSpaceInputPopUp = () => {
    newSpace ? setNewSpace(false) : setNewSpace(true);
  };

  const handleSpaceName = (e) => {
    setSpaceName(e.target.value);
  };

  const handleCreateSpace = () => {
    const userID = localStorage.getItem('userID');

    fetch('http://localhost:8080/createSpace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spaceName: spaceName, userID: userID })
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // sending space name variable to space component (for invites)
          history.push({
            pathname: `/space/${result.spaceID}`,
            state: { spaceName: spaceName, spaceID: result.spaceID }
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <article className="App">
      <section className="">
        <h1>FriendsZone</h1>
        <div className="">
          {!props.isAuth ? (
            <button>
              <NavLink to="/login">Login / Register</NavLink>
            </button>
          ) : null}
          {props.isAuth ? (
            <button>
              <NavLink to="/logout">Logout</NavLink>
            </button>
          ) : null}
          {props.isAuth ? (
            <button>
              <NavLink to="/zone">View My Zone</NavLink>
            </button>
          ) : null}
          {props.isAuth ? (
            <button onClick={handleNewSpaceInputPopUp}>Create New Space</button>
          ) : null}
          {props.isAuth && newSpace ? (
            <div className="">
              <input
                type="text"
                onChange={handleSpaceName}
                placeholder="Enter Space Name"
              />
              <button onClick={handleCreateSpace}>Create</button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="">
        <img src="" />
      </section>
    </article>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth
  };
};

export default connect(mapStateToProps)(Main);
