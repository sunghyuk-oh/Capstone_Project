const router = express.Router();

router.post('/register', (req, res) => {
  const { firstName, lastName, email, username, password, confirmPassword } =
    req.body;

  if (password !== confirmPassword) {
    res.json({
      success: false,
      message: 'The passwords are not matched. Please try again.'
    });
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  db.any('SELECT username, password FROM users WHERE username = $1', [username])
    .then((user) => {
      if (user.length > 0) {
        res.json({
          success: false,
          message: 'Username already existed. Please try again.'
        });
      } else {
        db.none(
          'INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5);',
          [username, hash, firstName, lastName, email]
        ).then(
          db
            .one('SELECT user_id from users where username = $1', [username])
            .then((user) => {
              const userID = user.user_id;
              const token = jwt.sign(
                { username: username, userID: userID },
                `${process.env.JWT_SECRET_KEY}`
              );
              res.json({
                success: true,
                token: token,
                username: username,
                userID: userID
              });
            })
        );
      }
    })
    .catch((err) => console.error(err));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.any('SELECT user_id, username, password FROM users WHERE username = $1', [
    username
  ])
    .then((foundUser) => {
      if (foundUser.length > 0) {
        const userID = foundUser[0].user_id;
        bcrypt.compare(password, foundUser[0].password, function (err, result) {
          if (result) {
            const token = jwt.sign(
              { username: username, userID: userID },
              `${process.env.JWT_SECRET_KEY}`
            );

            res.json({
              success: true,
              token: token,
              username: username,
              userID: userID
            });
          } else {
            res.json({
              success: false,
              message: 'Password is incorrect. Please try again.'
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: 'Username does not exist. Please try again.'
        });
      }
    })
    .catch((err) => console.error(err));
});

module.exports = router;
