import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import * as actionCreators from '../stores/creators/actionCreators';

function SpaceNav(props) {
  const history = useHistory();
  const [spaceName, setSpaceName] = useState('');
  const [isNewSpace, setIsNewSpace] = useState(false);
  const spaceID = useParams().spaceid;

  useEffect(() => {
    if (props.isAuth) {
      viewAllSpaces();
    }
  }, [spaceID]);

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
      <div key={space.space_id} className="spaceBlock">
        <h3 className="spaceTitle">
          <button className="toSpaceBtn">
            <NavLink
              className="spaceLink"
              to={{
                pathname: `/space/${space.space_id}`,
                state: { spaceID: space.space_id, spaceName: space.space_name }
              }}
            >
              {space.space_name}
            </NavLink>
          </button>
        </h3>
      </div>
    );
  });

  return (
    <section id="spaceNav">
      {props.isAuth && isNewSpace ? (
        <div id="spaceCredentials">
          <button id="minSpaceBtn" onClick={handleNewSpaceInputPopUp}>
            x
          </button>
          <h2>Create New Space</h2>
          <p>
            By creating a space you can invite friends, chat, and plan new
            events!
          </p>
          <input
            type="text"
            onChange={handleSpaceName}
            placeholder="Enter Space Name"
          />
          <button id="submitSpaceBtn" onClick={handleCreateSpace}>
            Create
          </button>
        </div>
      ) : null}
      <section id="createSpaceSection">
        <h1>My Spaces</h1>
        <button id="createSpaceBtn" onClick={handleNewSpaceInputPopUp}>
          +{/* +<span id="createHoverText">Add New Space</span> */}
        </button>
      </section>
      <section id="mySpacesList">{allMySpace}</section>
    </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpaceNav);
