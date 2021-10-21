const router = express.Router();

router.get('/displayAllEvents/:space_id', (req, res) => {
    const { space_id } = req.params

    db.any('SELECT * FROM events WHERE space_id = $1', [space_id])
    .then((allEvents) => {
        res.json({ success: true, all_events: allEvents })
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
        const firstName = foundUser[0].first_name
        const lastName = foundUser[0].last_name
        
        db.none("INSERT INTO event_invites (status, event_id, space_id, user_id) VALUES ('Maybe', $1, $2, $3)", [eventID, spaceID, userID])
        .then(
            res.json({ success: true, message: "An attendee has been added to the event.", member: {username: username, firstName: firstName, lastName: lastName}})
        )
    })
    .catch(err => console.log(err))
})

module.exports = router;
