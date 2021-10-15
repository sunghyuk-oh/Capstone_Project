import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from 'react-redux'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import DatePicker from "react-datepicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import * as actionCreators from '../stores/creators/actionCreators'


const locales = {
    "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})


function Event(props) {
    const spaceID = useParams().spaceid;
    const userID = localStorage.getItem('userID');
    const [newEvent, setNewEvent] = useState({ title: "", start_date: "", end_date: "", location: "", user_id: userID, space_id: spaceID })
    

    useEffect(() => {
        displayAllEvents()
    }, [])


    const displayAllEvents = () => {
        props.onDisplayAllEvents(spaceID)
    }

    const handleAddEvent = (newEvent) => {
        props.onAddNewEvent(newEvent)
    }

    const allEvents = props.allEvents.map(event => {
        return {
            title: event.title,
            start_date: new Date(event.start_date),
            end_date: new Date(event.end_date)
        }
    })


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
                <button onClick={() => handleAddEvent(newEvent)}>Add Event</button>
            </div>

            <Calendar localizer={localizer} events={allEvents} startAccessor="start_date" endAccessor="end_date" defaultDate={new Date()} style={{ height: 500, margin: "50px" }} />
        </section>
    )
}

const mapStateToProps = (state) => {
    return {
        allEvents: state.allEvents
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDisplayAllEvents: (spaceID) => dispatch(actionCreators.displayAllEvents(spaceID)),
        onAddNewEvent: (event) => dispatch(actionCreators.addNewEvent(event))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Event)