import { useState } from 'react';
import * as actionCreators from '../stores/creators/actionCreators';

function EventDetails(props) {
  const [invitee, setInvitee] = useState({
    eventID: props.event.event_id,
    spaceID: props.event.space_id,
    username: ''
  });
  const [eventInviteMsg, setEventInviteMsg] = useState({
    isDisplay: false,
    message: ''
  });
  const messageStyle = { color: '#fed3e4' };

  const convertTimeFormat = (date) => {
    if (date.toString() === 'Invalid Date') {
      return ' ';
    }

    let hour = date.getHours();
    let minute = date.getMinutes();

    if (hour === 0) {
      hour = '00';
    }
    if (minute === 0) {
      minute = '00';
    }

    return `${hour}:${minute}`;
  };

  const startTime = convertTimeFormat(new Date(props.event.start_date));
  const endTime = convertTimeFormat(new Date(props.event.end_date));

  const inviteUsers = () => {
    actionCreators.inviteMember(invitee, props.setAttendees, setEventInviteMsg);

    setInvitee({ ...invitee, username: '' });
  };

  const allAttendees = props.attendees.map((each) => {
    return (
      <div className="attendees">
        <p>
          {each.first_name} {each.last_name[0]}.
        </p>
      </div>
    );
  });

  return (
    <section id="eventDetails">
      <h5>Details:</h5>
      <div id="details">
        <p>
          <b>Time: </b>
          {startTime} - {endTime}
        </p>
        <p>
          <b>Location: </b>
          {props.event.location}
        </p>
        <p>
          <b>Attendees: </b>
          {allAttendees}
        </p>
      </div>
      <div id="eventInvite">
        <h4>Invite Friends</h4>
        {eventInviteMsg.isDisplay ? (
          <div>
            <p style={messageStyle}>{eventInviteMsg.message}</p>
          </div>
        ) : null}
        <input
          id="eventInviteInput"
          type="text"
          placeholder="Username"
          value={invitee.username}
          onChange={(e) => setInvitee({ ...invitee, username: e.target.value })}
        />
        <button id="eventInviteBtn" onClick={inviteUsers}>
          Invite
        </button>
      </div>
    </section>
  );
}

export default EventDetails;
