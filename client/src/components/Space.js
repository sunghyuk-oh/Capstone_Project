import Event from './Event';
import EventDetails from './EventDetails';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Chat from './Chat';
import SpaceNav from './SpaceNav';
import MobileSpace from './MobileSpace';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Icon } from 'semantic-ui-react';
import Post from './Post';
import * as actionCreators from '../stores/creators/actionCreators';

function Space(props) {
  const socket = window.socket;
  const history = useHistory();
  const [recipientUserName, setRecipientUserName] = useState('');
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isExpanded, setExpanded] = useState({ expanded: '', close: true });
  const [singleEventToggle, setSingleEventToggle] = useState(0);
  const [isEventSlideDown, setIsEventSlideDown] = useState(false);
  const [eventAttendees, setEventAttendees] = useState([]);
  const spaceID = useParams().spaceid;
  const spaceName = useParams().spacename;
  const userID = localStorage.getItem('userID');
  const username = localStorage.getItem('username');
  const calendarStyle = { height: 400, width: 300, margin: '50px' };
  const expandedCalendarStyle = { height: 600, width: 600, margin: '50px' };

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

  const toggleExpanded = (e) => {
    let componentName = e.target.name;
    setExpanded({ expanded: componentName, close: !isExpanded['close'] });
  };

  return (
    <div id="spaceContainer">
      <MobileSpace socket={socket} username={username} spaceID={spaceID} />
      <section id="space">
        <section id="spaceTitle">
          <h1>{spaceName}</h1>
        </section>
        <section
          id={
            isExpanded['expanded'] === 'spaces' && isExpanded['close'] === false
              ? 'expandedSpacesInfo'
              : 'spacesInfo'
          }
        >
          <button
            name="spaces"
            className="expandComponent"
            onClick={toggleExpanded}
          >
            <Icon
              className="icon"
              name="expand arrows alternate"
              color="blue"
            />
          </button>
          <SpaceNav />
        </section>
        <section
          id={
            isExpanded['expanded'] === 'members' &&
            isExpanded['close'] === false
              ? 'expandedMemberInfo'
              : 'memberInfo'
          }
        >
          <button
            name="members"
            className="expandComponent"
            onClick={toggleExpanded}
          >
            <Icon name="expand arrows alternate" color="blue" />
          </button>
          <span className="sectionHeader">Members</span>
          <div id="memberList">{allMembers}</div>
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
        </section>
        <section
          id={
            isExpanded['expanded'] === 'posts' && isExpanded['close'] === false
              ? 'expandedPostSection'
              : 'postSection'
          }
        >
          <button
            name="posts"
            className="expandComponent"
            onClick={toggleExpanded}
          >
            <Icon name="expand arrows alternate" color="blue" />
          </button>
          <span id="postSectionTitle">Post Feed</span>
          <Post posts={posts} setPosts={setPosts} spaceID={spaceID} />
        </section>
        <section
          id={
            isExpanded['expanded'] === 'chat' && isExpanded['close'] === false
              ? 'expandedChatSection'
              : 'chatSection'
          }
        >
          <button
            name="chat"
            className="expandComponent"
            onClick={toggleExpanded}
          >
            <Icon name="expand arrows alternate" color="blue" />
          </button>
          <span id="chatTitle">Let's Chat</span>
          <Chat socket={socket} username={username} spaceID={spaceID} />
        </section>
        <section
          id={
            isExpanded['expanded'] === 'eventList' &&
            isExpanded['close'] === false
              ? 'expandedEventList'
              : 'eventList'
          }
        >
          <button
            name="eventList"
            className="expandComponent"
            onClick={toggleExpanded}
          >
            <Icon name="expand arrows alternate" color="blue" />
          </button>
          <h3 id="eventListTitle">Upcoming Events</h3>
          {allEvents}
        </section>
        <div
          id={
            isExpanded['expanded'] === 'event' && isExpanded['close'] === false
              ? 'expandedEventContainer'
              : 'eventContainer'
          }
        >
          <button
            name="event"
            className="expandComponent"
            onClick={toggleExpanded}
          >
            <Icon
              className="icon"
              name="expand arrows alternate"
              color="blue"
            />
          </button>
          {isExpanded['expanded'] === 'event' &&
          isExpanded['close'] === false ? (
            <Event
              events={events}
              setEvents={setEvents}
              style={expandedCalendarStyle}
            />
          ) : (
            <Event
              events={events}
              setEvents={setEvents}
              style={calendarStyle}
            />
          )}
        </div>
      </section>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth
  };
};

export default connect(mapStateToProps)(Space);
