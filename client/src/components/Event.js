import { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import DatePicker from "react-datepicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";


const locales = {
    "en-US": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

const events = [
    {
        title: "Big Meeting",
        allDay: false,
        start_date: new Date(2021, 9, 14, 9, 0, 0),
        end_date: new Date(2021, 9, 14)
    },
    {
        title: "Vacation",
        start: new Date(2021, 10, 20),
        end: new Date(2021, 10, 21)
    }
]

function Event() {
    const spaceID = useParams().spaceid;
    const userID = localStorage.getItem('userID');
    const [newEvent, setNewEvent] = useState({ title: "", start_date: "", end_date: "", location: "", username: "", user_id: userID, space_id: spaceID })
    const [attendee, setAttendee] = useState({ username: "" })
    const [eventID, setEventID] = useState("")
    
    const [allEvents, setAllEvents] = useState(events)
    
    function handleEvents() {
        setAllEvents([...allEvents, newEvent])

        fetch("http://localhost:8080/createEvent", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(newEvent)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // setEventID(result.eventID.toString())
                console.log(result.message)  
            } else {
                console.log('Adding a new event failed')
            }
        })
        .catch(err => console.log(err))

        
        // fetch("http://localhost:8080/addEventAttendee", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json"},
        //     body: JSON.stringify({ username: attendee.username, event_id: eventID, space_id: spaceID })
        // })
        // .then(response => response.json())
        // .then(result => {
        //     if (result.success) {
        //         console.log(result.message)
        //     } else {
        //         console.log('Adding an attendee for this event failed')
        //     }
        // })
        // .catch(err => console.log(err))
    }

    console.log(allEvents)
    console.log(newEvent)
    return (
        <section className="">
            <div>
                <div>
                    <h3>New Event:</h3>
                    <input type="text" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />

                    <DatePicker placeholderText="Start Date" selected={newEvent.start_date} showTimeSelect onChange={(start_date) => setNewEvent({ ...newEvent, start_date })} />

                    <DatePicker placeholderText="End Date" selected={newEvent.end_date} showTimeSelect onChange={(end_date) => setNewEvent({ ...newEvent, end_date })} />

                </div>
                <div>   
                    <h3>Location:</h3>
                    <input type="text" placeholder="Full Address (optional)" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value})} />
                </div>
                <div>   
                    <h3>Attendee:</h3>
                    <input type="text" placeholder="Username" value={newEvent.username} onChange={e => setNewEvent({...newEvent, username: e.target.value})} />
                </div>
                
                <button onClick={handleEvents}>Add Event</button>
            </div>

            <Calendar localizer={localizer} events={allEvents} startAccessor="start_date" endAccessor="end_date" defaultDate={new Date()} style={{ height: 500, margin: "50px" }} />
        </section>
    )
}

export default Event