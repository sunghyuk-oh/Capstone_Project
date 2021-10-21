import Event from './Event';
import EventDetails from './EventDetails';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Chat from './Chat';
import SpaceNav from './SpaceNav';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import Post from './Post';
import * as actionCreators from '../stores/creators/actionCreators';

function MobileSpace(props) {
  const socket = window.socket;
  const location = useLocation();
  // const spaceName =
  //   props.isAuth && location.state.spaceName !== undefined
  //     ? location.state.spaceName
  //     : 'Error';
  const spaceName = useParams().spaceid;
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [members, setMembers] = useState([]);
  const [isActive, setActive] = useState({
    active: 'titleAndMembers'
  });
  const spaceID = useParams().spaceid;
  const userID = localStorage.getItem('userID');

  useEffect(() => {
    authSpaceUsers();
    joinSpace();
    displaySpaceMembers();
  }, []);

  useEffect(() => {
    displayAllEvents();
  }, []);

  const authSpaceUsers = () => {
    const authData = { spaceID: spaceID, userID: userID };
    actionCreators.authUsers(authData, history);
  };

  const displaySpaceMembers = () => {
    actionCreators.listMembers(spaceID, setMembers);
  };

  const joinSpace = () => {
    socket.emit('join_space', spaceID);
  };

  const displayAllEvents = () => {
    props.onDisplayAllEvents(spaceID);
  };

  const handleUsernameInput = (e) => {
    setUserName(e.target.value);
  };

  const handleInviteSubmit = () => {
    const inviteData = { userName: userName, spaceID: spaceID };
    actionCreators.invite(inviteData);
  };

  const allMembers = members.map((member, index) => {
    return (
      <div key={index} className="spaceMember">
        <span className="memberInitials">
          {member.first_name[0]}
          {member.last_name[0]}
        </span>
        <span>({member.username})</span>
      </div>
    );
  });

  console.log(members);

  const convertDateFormat = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const year = date.getFullYear();
    const month = date.getMonth();
    const numDay = date.getDate();
    const day = date.getDay();

    return `${month}/${numDay}/${year}  ${days[day]}`;
  };

  const allEvents = props.allEvents.map((event) => {
    const startDate = convertDateFormat(new Date(event.start_date));
    const endDate = convertDateFormat(new Date(event.end_date));

    return (
      <div key={event.event_id}>
        <h4>{event.title}</h4>
        <p>
          {startDate} - {endDate}
        </p>
      </div>
    );
  });

  const handleActive = (e) => {
    let componentName = e.target.name;
    setActive({
      active: componentName
    });
  };

  return (
    <section id="mobileSpace">
      <nav id="componentSelect">
        <button
          name="spaces"
          className="toggleComponents"
          onClick={handleActive}
        >
          Spaces
        </button>
        <button
          name="titleAndMembers"
          className="toggleComponents"
          onClick={handleActive}
        >
          Info
        </button>
        <button
          name="posts"
          className="toggleComponents"
          onClick={handleActive}
        >
          Posts
        </button>
        <button name="chat" className="toggleComponents" onClick={handleActive}>
          Chat
        </button>
        <button
          name="events"
          className="toggleComponents"
          onClick={handleActive}
        >
          Events
        </button>
      </nav>

      {isActive['active'] === 'titleAndMembers' ? (
        <div id="spaceAdmin">
          <section id="spaceTitle">
            <h1>{spaceName}</h1>
          </section>
          <section id="memberInfo">
            <span className="sectionHeader">Members</span>
            <div id="memberList">{allMembers}</div>
          </section>
          <section id="userInvite">
            <span className="sectionHeader">User Invite</span>
            <input
              id="inviteInput"
              type="text"
              placeholder="Enter Invitee's Username"
              name="usernameInput"
              onChange={handleUsernameInput}
            />
            <button id="inviteBtn" onClick={handleInviteSubmit}>
              Invite
            </button>
          </section>
        </div>
      ) : null}

      {isActive['active'] === 'spaces' ? (
        <section id="spacesInfo">
          <SpaceNav />
        </section>
      ) : null}

      {isActive['active'] === 'posts' ? (
        <section id="postSection">
          <span>Posts</span>
          <Post spaceID={spaceID} />
        </section>
      ) : null}

      {isActive['active'] === 'chat' ? (
        <section id="chatSection">
          <span>Chat</span>
          <Chat
            socket={socket}
            username={localStorage.username}
            spaceID={spaceID}
          />
        </section>
      ) : null}
      {isActive['active'] === 'events' ? (
        <div id="eventAdmin">
          <section id="eventList">
            Event List
            {allEvents}
          </section>
          <Event />
          <EventDetails />
        </div>
      ) : null}
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    allEvents: state.allEvents,
    isAuth: state.isAuth
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDisplayAllEvents: (spaceID) =>
      dispatch(actionCreators.displayAllEvents(spaceID))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileSpace);
