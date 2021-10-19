import Event from './Event';
import EventDetails from './EventDetails';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client';
import Chat from './Chat';
import SpaceNav from './SpaceNav';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import * as actionCreators from '../stores/creators/actionCreators';
const socket = io.connect('http://localhost:8080');

function MobileSpace(props) {
  const location = useLocation();
  const spaceName = location.state.spaceName;
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [members, setMembers] = useState([]);
  const [isHidden, setHidden] = useState({
    spaces: true,
    titleAndMembers: false,
    chat: false,
    posts: false,
    events: false
  });
  const spaceID = useParams().spaceid;
  const userID = localStorage.getItem('userID');

  useEffect(() => {
    authSpaceUsers();
    displaySpaceMembers();
    joinSpace();
    displayAllEvents();
  }, [spaceID]);

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
        <h5>
          {member.first_name} {member.last_name}
        </h5>
      </div>
    );
  });

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

  const handleHidden = (e) => {
    let hiddenName = e.target.name;
    let hiddenStatus = isHidden[hiddenName];
    setHidden({
      ...isHidden,
      [hiddenName]: !hiddenStatus
    });
  };

  return (
    <section id="mobileSpace">
      <button
        name="titleAndMembers"
        id="showTitleAndMembers"
        class="toggleComponents"
        onClick={handleHidden}
      >
        Space Title + Members
      </button>
      {isHidden['titleAndMembers'] ? (
        <div>
          <section id="spaceTitle">
            <h1>{spaceName}</h1>
          </section>
          <section id="memberInfo">
            <span>Members</span>
            <div id="memberList">{allMembers}</div>
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
        </div>
      ) : null}
      <button
        name="spaces"
        id="showSpaces"
        class="toggleComponents"
        onClick={handleHidden}
      >
        View Spaces
      </button>
      {isHidden['spaces'] ? (
        <section id="spacesInfo">
          <SpaceNav />
        </section>
      ) : null}
      <button
        name="posts"
        id="showPosts"
        class="toggleComponents"
        onClick={handleHidden}
      >
        View Posts
      </button>
      {isHidden['posts'] ? <section id="postSection">Post List</section> : null}
      <button
        name="chat"
        id="showChat"
        class="toggleComponents"
        onClick={handleHidden}
      >
        View Chat
      </button>
      {isHidden['chat'] ? (
        <section id="chatSection">
          <span>Chat</span>
          <Chat
            socket={socket}
            username={localStorage.username}
            spaceID={spaceID}
          />
        </section>
      ) : null}

      <button
        name="events"
        id="showEvents"
        class="toggleComponents"
        onClick={handleHidden}
      >
        View Events
      </button>
      {isHidden['events'] ? (
        <div>
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
    allEvents: state.allEvents
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDisplayAllEvents: (spaceID) =>
      dispatch(actionCreators.displayAllEvents(spaceID))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileSpace);