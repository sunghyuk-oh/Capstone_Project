const router = express.Router();

router.post('/createEvent', (req, res) => {
    const { title, start_date, end_date, location, username, space_id, user_id } = req.body

    db.none('INSERT INTO events (title, start_date, end_date, location, space_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)', [title, start_date, end_date, location, space_id, user_id])
    .then(() => {
        db.any('SELECT event_id FROM events WHERE title = $1 AND start_date = $2 AND end_date = $3 AND location = $4', [title, start_date, end_date, location])
        .then((eventID) => {
            const event_id = eventID[0].event_id
            
            db.any("SELECT user_id FROM users WHERE username = $1", [username])
            .then((userID) => {
                const user_id = userID[0].user_id
                
                db.none("INSERT INTO event_invites (status, event_id, space_id, user_id) VALUES ('Maybe', $1, $2, $3)", [event_id, space_id, user_id])
                .then(
                    res.json({ success: true, message: "A new event has been created." })
                )
            })
            .catch(err => console.log(err))
        })
    })
    .catch(err => console.log(err))
        
})

module.exports = router;
