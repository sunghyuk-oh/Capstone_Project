const router = express.Router();

router.get('/displayAllEvents/:space_id', (req, res) => {
    const { space_id } = req.params

    db.any('SELECT * FROM events WHERE space_id = $1', [space_id])
    .then((allEvents) => {
        res.json({ success: true, all_events: allEvents })
    })
    .catch(err => console.log(err))
})

router.get('/displayAllEventAttendees/:eventID/:spaceID', (req, res) => {
    const { eventID, spaceID } = req.params

    db.any('SELECT event_invites.event_invite_id, users.user_id, users.username, users.first_name, users.last_name FROM event_invites INNER JOIN users ON users.user_id = event_invites.user_id WHERE event_invites.space_id = $1 AND event_invites.event_id = $2 ORDER BY event_invites.event_invite_id ASC', [spaceID, eventID])
    .then((attendees) => {
        res.json({ allAttendees: attendees})
    })
    .catch(err => console.log(err))
})

router.post('/createEvent', (req, res) => {
    const { title, start_date, end_date, location, space_id, user_id } = req.body

    db.none('INSERT INTO events (title, start_date, end_date, location, space_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)', [title, start_date, end_date, location, space_id, user_id])
    .then(() => {
        db.any('SELECT * FROM events WHERE space_id = $1', [space_id])
        .then((allEvents) => {
            res.json({ success: true, all_events: allEvents })
        })
    })
    .catch(err => console.log(err))
})

router.post('/inviteMember', (req, res) => {
    const { eventID, spaceID, username } = req.body

    db.any("SELECT user_id, first_name, last_name FROM users WHERE username = $1", [username])
    .then((foundUser) => {
        const userID = foundUser[0].user_id
        
        db.none("INSERT INTO event_invites (status, event_id, space_id, user_id) VALUES ('Maybe', $1, $2, $3)", [eventID, spaceID, userID])
        .then(() => {
            db.any('SELECT event_invites.event_invite_id, users.user_id, users.username, users.first_name, users.last_name FROM event_invites INNER JOIN users ON users.user_id = event_invites.user_id WHERE event_invites.space_id = $1 AND event_invites.event_id = $2 ORDER BY event_invites.event_invite_id ASC', [spaceID, eventID])
            .then((attendees) => {
                res.json({ success: true, allAttendees: attendees})
            })
        })
    })
    .catch(err => console.log(err))
})

module.exports = router;
