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
    .then(res.json({ success: true, message: "A new event has been created." }))
    .catch(err => console.log(err))
})

// router.post('/addEventAttendee', (req, res) => {
//     db.any("SELECT user_id FROM users WHERE username = $1", [username])
//         .then((userID) => {
//             const user_id = userID[0].user_id
            
//             db.none("INSERT INTO event_invites (status, event_id, space_id, user_id) VALUES ('Maybe', $1, $2, $3)", [event_id, space_id, user_id])
//             .then(
//                 res.json({ success: true, message: "A new event has been created." })
//             )
//         })
//         .catch(err => console.log(err))
// })

module.exports = router;
