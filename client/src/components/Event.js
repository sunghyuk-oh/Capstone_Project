import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import * as actionCreators from '../stores/creators/actionCreators';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

function Event(props) {
  const spaceID = useParams().spaceid;
  const userID = localStorage.getItem('userID');
  const [newEvent, setNewEvent] = useState({
    title: '',
    start_date: '',
    end_date: '',
    location: '',
    user_id: userID,
    space_id: spaceID
  });

  const handleAddEvent = (newEvent) => {
    actionCreators.addNewEvent(newEvent, props.setEvents);
    setNewEvent({
      title: '',
      start_date: '',
      end_date: '',
      location: '',
      user_id: userID,
      space_id: spaceID
    });
  };

  const allEvents = props.events.map((event) => {
    return {
      title: event.title,
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date)
    };
  });

  return (
    <section id="event">
      <div id="calendar">
        <Calendar
          localizer={localizer}
          events={props.allEvents}
          startAccessor="start_date"
          endAccessor="end_date"
          defaultDate={new Date()}
          style={props.style}
        />
      </div>
      <div id="newEvent">
        <div id="eventDataInput">
          <h3>New Event:</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <div>
            <DatePicker
              placeholderText="Start Date"
              selected={newEvent.start_date}
              showTimeSelect
              onChange={(start_date) =>
                setNewEvent({ ...newEvent, start_date })
              }
            />
          </div>
          <div>
            <DatePicker
              placeholderText="End Date"
              selected={newEvent.end_date}
              showTimeSelect
              onChange={(end_date) => setNewEvent({ ...newEvent, end_date })}
            />
          </div>
          <h3>Location:</h3>
          <input
            type="text"
            placeholder="Full Address (optional)"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
          />
          <button onClick={() => handleAddEvent(newEvent)}>Add Event</button>
        </div>
      </div>
    </section>
  );
}

export default Event;
