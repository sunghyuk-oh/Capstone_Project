const router = express.Router();

router.post('/createSpace', (req, res) => {
  const { spaceName, userID } = req.body;

  db.none('INSERT INTO spaces (space_name, user_id) VALUES ($1, $2)', [
    spaceName,
    userID
  ])
    .then(() => {
      db.any(
        'SELECT space_id FROM spaces WHERE space_name = $1 AND user_id = $2',
        [spaceName, userID]
      ).then((space) => {
        db.none(
          'INSERT INTO space_members (space_id, user_id, created_space) VALUES ($1, $2, $3)',
          [space[0].space_id, userID, true]
        );
        res.json({
          success: true,
          message: 'The new space has been created!',
          spaceID: space[0].space_id,
          spaceName: spaceName
        });
      });
    })
    .catch((err) => console.log(err));
});

// Invite logic - server route works good
router.post('/invite', (req, res) => {
  const recipientUserName = req.body.recipientUserName;
  const senderUserID = req.body.userID;
  const senderUserName = req.body.senderUserName;
  const spaceID = req.body.spaceID;
  let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '3442ef7accc2bb',
      pass: 'cdbb4398ec1243'
    }
  });

  db.one(
    'SELECT DISTINCT users.first_name, users.last_name, users.email FROM space_invites INNER JOIN users ON space_invites.sender_user_id = users.user_id WHERE sender_user_id = $1 AND space_id = $2',
    [senderUserID, spaceID]
  )
    .then((sender) => {
      const senderFirstName = sender.first_name;
      const senderLastName = sender.last_name;
      const senderEmail = sender.email;
      db.one('SELECT user_id, email from users where username = $1', [
        recipientUserName
      ]).then((user) => {
        const recipientUserID = user.user_id;
        const recipientEmail = user.email;
        const message = {
          from: 'gatheround@email.com',
          to: `${recipientEmail}`,
          subject: `You've been invited!`,
          html: `<p>Hi ${recipientUserName}! You've been invited to ${spaceID} by ${senderFirstName} ${senderLastName}!</p>`
        };

        transport.sendMail(message, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
          }
        });

        db.none(
          'INSERT INTO space_invites (space_id, sender_user_id, recipient_user_id) VALUES($1, $2, $3)',
          [spaceID, senderUserID, recipientUserID]
        ).then(
          res.json({
            success: true,
            message: `User ID: ${recipientUserID} has been invited to Space: ${spaceID}`
          })
        );
      });
    })

    .catch((err) => console.log(err));
});

// authenticate space
router.get('/auth/:spaceID/:userID', (req, res) => {
  const spaceID = req.params.spaceID;
  const userID = req.params.userID;

  db.any(
    'SELECT space_id FROM space_members WHERE user_id=$1 GROUP BY space_id',
    [userID]
  ).then((userSpaces) => {
    const allSpaces = userSpaces.map((space) => {
      return space.space_id;
    });
    if (allSpaces.includes(parseInt(spaceID))) {
      res.json({ success: true, message: 'User is authenticated in Space' });
    } else {
      res.json({
        success: false,
        message: 'User is not authenticated in Space'
      });
    }
  });
});

router.get('/displayMembers/:spaceID', (req, res) => {
  const spaceID = req.params.spaceID;

  db.any(
    'SELECT username, first_name, last_name FROM users INNER JOIN space_members ON users.user_id = space_members.user_id WHERE space_members.space_id = $1',
    [spaceID]
  ).then((spaceMembers) => {
    const allMembers = spaceMembers;

    res.json({ success: true, members: allMembers });
  });
});

router.get('/viewSpace/:userID', authenticate, (req, res) => {
  const { userID } = req.params;

  db.any(
    'SELECT space_members.space_id, space_members.user_id, spaces.space_name FROM space_members INNER JOIN spaces ON space_members.space_id = spaces.space_id WHERE space_members.user_id = $1',
    [userID]
  ).then((foundSpaces) => {
    res.json(foundSpaces);
  });
});

router.get('/viewInvites/:userID', authenticate, (req, res) => {
  const { userID } = req.params;

  db.any(
    'SELECT DISTINCT space_invites.space_id, spaces.space_name, space_invites.sender_user_id, users.first_name as sender_first_name,users.last_name as sender_last_name,space_invites.recipient_user_id FROM space_invites INNER JOIN spaces ON space_invites.space_id = spaces.space_id INNER JOIN users ON space_invites.sender_user_id = users.user_id WHERE recipient_user_id = $1',
    [userID]
  ).then((invites) => {
    res.json(invites);
  });
});

module.exports = router;
