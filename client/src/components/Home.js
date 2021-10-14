import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../stores/creators/actionCreators';

function Main(props) {
  const history = useHistory();
  const [spaceName, setSpaceName] = useState('');
  const [isNewSpace, setIsNewSpace] = useState(false);

  useEffect(() => {
    if (props.isAuth) {
      viewAllSpaces();
    }
  }, []);

  const handleNewSpaceInputPopUp = () => {
    isNewSpace ? setIsNewSpace(false) : setIsNewSpace(true);
  };

  const handleSpaceName = (e) => {
    setSpaceName(e.target.value);
  };

  const handleCreateSpace = () => {
    const userID = localStorage.getItem('userID');
    const createData = { spaceName: spaceName, userID: userID };
    actionCreators.addSpace(createData, history);
  };

  const viewAllSpaces = () => {
    const token = localStorage.getItem('userToken');
    const userID = localStorage.getItem('userID');
    const viewData = { userID: userID, token: token };
    props.onViewMySpace(viewData);
  };

  const allMySpace = props.mySpaceList.map((space) => {
    return (
      <div key={space.space_id} className="eachSpace">
        <h3>{space.space_name}</h3>
        <button>
          <NavLink
            to={{
              pathname: `/space/${space.space_id}`,
              state: { spaceID: space.space_id, spaceName: space.space_name }
            }}
          >
            Go To Space
          </NavLink>
        </button>
      </div>
    );
  });

  return (
    <article className="App">
      <h1>FriendsZone</h1>
      <section className="">
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
            <button onClick={handleNewSpaceInputPopUp}>Create New Space</button>
          ) : null}
          {props.isAuth && isNewSpace ? (
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
        <div className="">
          <img src="" />
        </div>
      </section>
      <section className="">
        {props.isAuth ? <div className="">{allMySpace}</div> : null}
      </section>
    </article>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth,
    mySpaceList: state.mySpaceList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onViewMySpace: (data) => dispatch(actionCreators.loadSpaces(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
