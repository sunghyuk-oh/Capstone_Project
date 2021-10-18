const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get('/displayUserInfo/:userID', authenticate, (req, res) => {
    const { userID } = req.params
  
    db.any('SELECT username, first_name, last_name, email FROM users WHERE user_id = $1;', [userID])
    .then((userInfo) => {
        res.json({success: true, user: userInfo[0]})
    })
})

router.post('/updateUserInfo', (req, res) => {
    const { username, first_name, last_name, email } = req.body

    db.none('UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE username = $4', [first_name, last_name, email, username])
    .then(
        res.json({success: true, message: 'The user information has been successfully updated.'})
    )
})

module.exports = router;