import { useState } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../stores/creators/actionCreators';

function EventDetails(props) {
        const [ invitee, setInvitee ] = useState({ eventID: 35, spaceID: 15, username: "" })
        const [ attendee, setAttendee] = useState([])

        const dateCreated = "2021-10-15T03:36:54.084Z"

        const filteredEvents = props.allEvents.filter(event => {
                return event.date_created == dateCreated 
        })

        const events = filteredEvents.map(event => {
                // const startDate = convertDateFormat(event.start_date)
                // const endDate = convertDateFormat(event.end_date)

                return (
                        <div key={event.event_id}>
                                <h3>{event.title}</h3>
                                <p><strong>Date: </strong>{event.start_date} - {event.end_date}</p>
                                <p><strong>Location: </strong>{event.location}</p>
                        </div>
                )
        })

        const inviteUsers = () => {
                actionCreators.inviteMember(invitee, attendee, setAttendee)
        }

        const allAttendees = attendee.map(each => {
                return (
                        <div>
                          <p>{each.username} ({each.firstName} {each.lastName})</p>      
                        </div>
                )
        })
        
        return (
                <section>
                        <div>
                                {events}
                                {allAttendees}
                        </div>
                        <div>
                                <h3>Invite Friends</h3>
                                <input type="text" placeholder="Username" value={invitee.username} onChange={(e) => setInvitee({...invitee, username: e.target.value})} />
                                <button onClick={inviteUsers}>Invite</button>
                        </div>
                </section>
        )
}

const mapStateToProps = (state) => {
        return {
                allEvents: state.allEvents
        }
}

export default connect(mapStateToProps)(EventDetails)



