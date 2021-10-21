import Event from './Event';
import EventDetails from './EventDetails';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Chat from './Chat';
import SpaceNav from './SpaceNav';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import * as actionCreators from '../stores/creators/actionCreators';

function MobileSpace(props) {
  const socket = window.socket;
  const location = useLocation();
  const spaceName = props.isAuth ? location.state.spaceName : "Error"
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [isActive, setActive] = useState({
    active: 'titleAndMembers'
  });
  const [singleEventToggle, setSingleEventToggle] = useState(0)
  const [isEventSlideDown, setIsEventSlideDown] = useState(false)
  const [eventAttendees, setEventAttendees] = useState([])
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
    actionCreators.displayAllEvents(spaceID, setEvents)
  };

  const handleUsernameInput = (e) => {
    setUserName(e.target.value);
  };

  const handleInviteSubmit = () => {
    const inviteData = { userName: userName, spaceID: spaceID };
    actionCreators.invite(inviteData);
  };

  const handleSingleEventToggle = (eventID) => {
    setSingleEventToggle(eventID)
    !isEventSlideDown ? setIsEventSlideDown(true) : setIsEventSlideDown(false)
  }

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
    if (date.toString() === "Invalid Date") {
      return " "
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
      <div>
        <div key={event.event_id} onClick={()=> handleSingleEventToggle(event.event_id)}>
          <h4>{event.title}</h4>
          <p>
            {startDate} - {endDate}
          </p>
        </div>
        { isEventSlideDown && singleEventToggle === event.event_id ? 
            <div>
              <EventDetails event={event} attendees={eventAttendees} setAttendees ={setEventAttendees} />
            </div>
          : null
        }
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
          name="titleAndMembers"
          class="toggleComponents"
          onClick={handleActive}
        >
          Space Title + Members
        </button>
        <button name="spaces" class="toggleComponents" onClick={handleActive}>
          View Spaces
        </button>
        <button name="posts" class="toggleComponents" onClick={handleActive}>
          View Posts
        </button>
        <button name="chat" class="toggleComponents" onClick={handleActive}>
          View Chat
        </button>
        <button name="events" class="toggleComponents" onClick={handleActive}>
          View Events
        </button>
      </nav>

      {isActive['active'] === 'titleAndMembers' ? (
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

      {isActive['active'] === 'spaces' ? (
        <section id="spacesInfo">
          <SpaceNav />
        </section>
      ) : null}

      {isActive['active'] === 'posts' ? (
        <section id="postSection">Post List</section>
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
        <div>
          <section id="eventList">
            Event List
            {allEvents}
          </section>
          <Event events={events} setEvents={setEvents} />
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
