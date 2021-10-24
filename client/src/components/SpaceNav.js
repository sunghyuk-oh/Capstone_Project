import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import * as actionCreators from '../stores/creators/actionCreators';

function SpaceNav(props) {
  const history = useHistory();
  const [allSpaces, setAllSpaces] = useState([]);
  const [spaceName, setSpaceName] = useState('');
  const [isNewSpace, setIsNewSpace] = useState(false);
  const [pendingSpace, setPendingSpace] = useState([]);
  const [acceptMsg, setAcceptMsg] = useState({ isDisplay: false, message: '' });
  const [declineMsg, setDeclineMsg] = useState({
    isDisplay: false,
    message: ''
  });
  const spaceID = useParams().spaceid;
  const token = localStorage.getItem('userToken');
  const userID = localStorage.getItem('userID');
  const messageStyle = { color: '#fdafcc' };

  useEffect(() => {
    if (props.isAuth) {
      viewAllSpaces();
      viewAllInvites();
    }
  }, [spaceID]);

  const handleNewSpaceInputPopUp = () => {
    isNewSpace ? setIsNewSpace(false) : setIsNewSpace(true);
  };

  const handleSpaceName = (e) => {
    setSpaceName(e.target.value);
  };

  const handleCreateSpace = () => {
    const createData = { spaceName: spaceName, userID: userID };
    actionCreators.addSpace(createData, history);
  };

  const viewAllSpaces = () => {
    const viewData = { userID: userID, token: token };
    actionCreators.loadSpaces(viewData, setAllSpaces);
  };

  const viewAllInvites = () => {
    const viewData = { userID: userID, token: token };
    actionCreators.loadInvites(viewData, setPendingSpace);
  };

  const handleActive = () => {
    if (props.active) {
      props.active({
        active: 'titleAndMembers'
      });
    } else {
      console.log('Props Active is Not Loaded');
    }
  };

  const handleInviteAccept = (spaceInviteID, spaceID) => {
    const IDs = {
      userID: userID,
      spaceInviteID: spaceInviteID,
      spaceID: spaceID
    };
    actionCreators.acceptSpaceInvite(
      IDs,
      setAcceptMsg,
      setPendingSpace,
      setAllSpaces
    );
    viewAllSpaces();

    setTimeout(() => {
      setAcceptMsg({ isDisplay: false, message: '' });
    }, 5000);
  };

  const handleInviteDecline = (spaceID) => {
    const IDs = { userID: userID, spaceID: spaceID };
    actionCreators.declineSpaceInvite(IDs, setDeclineMsg, setPendingSpace);

    setTimeout(() => {
      setDeclineMsg({ isDisplay: false, message: '' });
    }, 5000);
  };

  const allMySpace = allSpaces.map((space) => {
    return (
      <div key={space.space_id} className="spaceBlock">
        <h3 className="spaceTitle">
          <button className="toSpaceBtn" onClick={handleActive}>
            <NavLink
              className="spaceLink"
              to={{
                pathname: `/space/${space.space_id}/${space.space_name}`
              }}
            >
              {space.space_name}
            </NavLink>
          </button>
        </h3>
      </div>
    );
  });

  const allMyInvites = pendingSpace.map((invite) => {
    return (
      <div key={invite.space_invite_id} className="inviteBlock">
        <h3>Invitation to {invite.space_name}</h3>
        <p>
          You've been invited to join {invite.space_name} by{' '}
          {invite.sender_first_name} {invite.sender_last_name}
        </p>
        <div className="inviteBtns">
          <button
            className="acceptBtn"
            onClick={() =>
              handleInviteAccept(invite.space_invite_id, invite.space_id)
            }
          >
            Accept
          </button>
          <button
            className="declineBtn"
            onClick={() => handleInviteDecline(invite.space_id)}
          >
            Decline
          </button>
        </div>
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
      <section id="mySpacesList">
        {acceptMsg.isDisplay ? (
          <div>
            <p style={messageStyle}>{acceptMsg.message}</p>
          </div>
        ) : null}
        {allMySpace}
      </section>
      <section id="inviteHeader">
        <h1>Pending Invites</h1>
        {declineMsg.isDisplay ? (
          <div>
            <p style={messageStyle}>{declineMsg.message}</p>
          </div>
        ) : null}
      </section>
      <section id="myInviteList">{allMyInvites}</section>
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
