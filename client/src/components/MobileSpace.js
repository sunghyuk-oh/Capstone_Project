import Event from './Event';
import EventDetails from './EventDetails';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Chat from './Chat';
import SpaceNav from './SpaceNav';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import Post from './Post';
import * as actionCreators from '../stores/creators/actionCreators';

function MobileSpace(props) {
  const socket = window.socket;
  const history = useHistory();
  const [recipientUserName, setRecipientUserName] = useState('');
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isActive, setActive] = useState({
    active: 'titleAndMembers'
  });
  const [singleEventToggle, setSingleEventToggle] = useState(0);
  const [isEventSlideDown, setIsEventSlideDown] = useState(false);
  const [eventAttendees, setEventAttendees] = useState([]);
  const spaceID = useParams().spaceid;
  const spaceName = useParams().spacename;
  const userID = localStorage.getItem('userID');
  const username = localStorage.getItem('username');
  const calendarStyle = {
    height: 500,
    width: 400,
    margin: '10px 10px 20px 10px'
  };

  useEffect(() => {
    authSpaceUsers();
    joinSpace();
    displayAllEvents();
    renderAllPosts();
    displaySpaceMembers();
  }, [spaceID]);

  const authSpaceUsers = () => {
    const authData = { spaceID: spaceID, userID: userID };
    actionCreators.authUsers(authData, history);
  };

  const displaySpaceMembers = () => {
    actionCreators.listMembers(spaceID, setMembers);
  };

  const joinSpace = () => {
    socket.emit('join_space', { spaceID, username, spaceName });
  };

  const displayAllEvents = () => {
    actionCreators.displayAllEvents(spaceID, setEvents);
  };

  const renderAllPosts = () => {
    actionCreators.displayAllPosts(spaceID, setPosts);
  };
  const handleUsernameInput = (e) => {
    setRecipientUserName(e.target.value);
  };

  const handleInviteSubmit = () => {
    const inviteData = {
      recipientUserName: recipientUserName,
      spaceID: spaceID,
      userID: userID,
      senderUserName: username
    };
    actionCreators.invite(inviteData);
    setRecipientUserName('');
  };

  const handleSingleEventToggle = (eventID) => {
    setSingleEventToggle(eventID);
    actionCreators.displayAllAttendees(eventID, spaceID, setEventAttendees);
    !isEventSlideDown ? setIsEventSlideDown(true) : setIsEventSlideDown(false);
  };

  const allMembers = members.map((member, index) => {
    return (
      <div key={index} className="spaceMember">
        <span className="memberInitials">
          {member.first_name[0]}
          {member.last_name[0]}
        </span>
        <span className="memberUsername">({member.username})</span>
      </div>
    );
  });

  const convertDateFormat = (date) => {
    if (date.toString() === 'Invalid Date') {
      return ' ';
    } else {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const numDay = date.getDate();
      const day = date.getDay();

      return `${month}/${numDay}/${year}  (${days[day]})`;
    }
  };

  const allEvents = events.map((event) => {
    const startDate = convertDateFormat(new Date(event.start_date));
    const endDate = convertDateFormat(new Date(event.end_date));

    return (
      <div className="eventBlock">
        <div
          className="eventInfo"
          key={event.event_id}
          onClick={() => handleSingleEventToggle(event.event_id)}
        >
          <h4>{event.title}</h4>
          <p>
            {startDate} - {endDate}
          </p>
        </div>
        {isEventSlideDown && singleEventToggle === event.event_id ? (
          <div className="eventDetailsBlock">
            <EventDetails
              event={event}
              attendees={eventAttendees}
              setAttendees={setEventAttendees}
            />
          </div>
        ) : null}
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
              value={recipientUserName}
              type="text"
              placeholder="Enter Username for Invite"
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
        <section id="mobileSpacesInfo">
          <SpaceNav active={setActive} />
        </section>
      ) : null}

      {isActive['active'] === 'posts' ? (
        <section id="postSection">
          <span id="postSectionTitle">Post Feed</span>
          <Post posts={posts} setPosts={setPosts} spaceID={spaceID} />
        </section>
      ) : null}

      {isActive['active'] === 'chat' ? (
        <section id="chatSection">
          <span id="chatTitle">Let's Chat</span>
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
            <h3>Upcoming Events</h3>
            {allEvents}
          </section>
          <Event events={events} setEvents={setEvents} style={calendarStyle} />
        </div>
      ) : null}
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth
  };
};

export default connect(mapStateToProps)(MobileSpace);
