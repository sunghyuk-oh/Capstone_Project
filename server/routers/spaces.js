const router = express.Router();

router.post('/createSpace', (req, res) => {
  const { spaceName, userID } = req.body;

  db.tx((t) => {
    return t
      .one(
        'INSERT INTO spaces (space_name, user_id) VALUES ($1, $2) RETURNING space_id',
        [spaceName, userID]
      )
      .then((space) => {
        t.one(
          'INSERT INTO space_members (space_id, user_id, created_space) VALUES ($1, $2, $3) RETURNING space_id',
          [space.space_id, userID, true]
        ).then((space) => {
          res.json({
            success: true,
            message: 'The new space has been created!',
            spaceID: space.space_id,
            spaceName: spaceName
          });
        });
      })
      .catch((err) => console.log(err));
  });
});

router.post('/acceptSpaceInvite', (req, res) => {
  const { userID, spaceInviteID, spaceID } = req.body;

  db.none(
    'UPDATE space_invites SET accepted = true WHERE recipient_user_id = $1 AND space_invite_id = $2',
    [userID, spaceInviteID]
  )
    .then(() => {
      db.none('INSERT INTO space_members (space_id, user_id) VALUES ($1, $2)', [
        spaceID,
        userID
      ]).then(() => {
        db.any(
          'SELECT space_invites.space_invite_id, space_invites.space_id, spaces.space_name, space_invites.sender_user_id, users.first_name as sender_first_name,users.last_name as sender_last_name,space_invites.recipient_user_id FROM space_invites INNER JOIN spaces ON space_invites.space_id = spaces.space_id INNER JOIN users ON space_invites.sender_user_id = users.user_id WHERE recipient_user_id = $1 AND accepted = false',
          [userID]
        ).then((invites) => {
          db.any(
            'SELECT space_members.space_id, space_members.user_id, spaces.space_name FROM space_members INNER JOIN spaces ON space_members.space_id = spaces.space_id WHERE space_members.user_id = $1',
            [userID]
          ).then((foundSpaces) => {
            res.json({
              allSpaces: foundSpaces,
              pendingSpaces: invites,
              message: 'A new space has been added to your space!'
            });
          });
        });
      });
    })
    .catch((err) => console.log(err));
});

router.delete('/declineSpaceInvite', (req, res) => {
  const { userID, spaceID } = req.body;

  db.none(
    'DELETE FROM space_invites WHERE recipient_user_id = $1 AND space_id = $2',
    [userID, spaceID]
  )
    .then(() => {
      db.any(
        'SELECT space_invites.space_invite_id, space_invites.space_id, spaces.space_name, space_invites.sender_user_id, users.first_name as sender_first_name,users.last_name as sender_last_name,space_invites.recipient_user_id FROM space_invites INNER JOIN spaces ON space_invites.space_id = spaces.space_id INNER JOIN users ON space_invites.sender_user_id = users.user_id WHERE recipient_user_id = $1 AND accepted = false',
        [userID]
      ).then((invites) => {
        res.json({
          pendingSpaces: invites,
          message: 'The pending space has been declined.'
        });
      });
    })
    .catch((err) => console.log(err));
});


router.post('/invite', (req, res) => {
  const recipientUserName = req.body.recipientUserName;
  const senderUserID = req.body.userID;
  const spaceID = req.body.spaceID;
  const spaceName = req.body.spaceName;
  let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '3442ef7accc2bb',
      pass: 'cdbb4398ec1243'
    }
  });

  db.task(async (t) => {
    return t
      .oneOrNone(
        'SELECT users.first_name, last_name FROM users WHERE user_id = $1',
        [senderUserID]
      )
      .then((sender) => {
        const senderFirstName = sender.first_name;
        const senderLastName = sender.last_name;

        return t
          .oneOrNone(
            'SELECT user_id, email, username from users where username = $1',
            [recipientUserName]
          )
          .then((user) => {
            if (user) {
              const recipientUserID = user.user_id;
              const recipientEmail = user.email;

              return t
                .oneOrNone(
                  'SELECT space_invite_id, recipient_username from space_invites where recipient_user_id = $1 and space_id = $2',
                  [recipientUserID, spaceID]
                )
                .then((foundRecipient) => {
                  if (foundRecipient) {
                    res.json({
                      success: false,
                      message: `${recipientUserName} has already been invited to Space.`
                    });
                  } else {
                    const message = {
                      from: 'gatheround@email.com',
                      to: `${recipientEmail}`,
                      subject: `You've been invited to a new Gather Space!`,
                      html: `
              <h3>You've been invited to a new Space!</h3>
              <p>Hi ${recipientUserName}! You've been invited to ${spaceName} by ${senderFirstName} ${senderLastName}!</p> 
              <p>Click the button below to view your invite!</p>
              <a href="http://gather.surge.sh/home"><button style="border: none; outline: none; border-radius: 3px; border: 1px solid black; margin: 3px auto; padding: 3px 0px 3px 5px; width: 100px; height: 30px; transition: 0.25s; font-size: 12px; font-weight: 500; color: black; background-color: #cdb4db;">View</button> </a>`
                    };

                    transport.sendMail(message, function (err, info) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(info);
                      }
                    });

                    db.tx(async (t) => {
                      await t.none(
                        'INSERT INTO space_invites (space_id, sender_user_id, recipient_username, recipient_user_id) VALUES($1, $2, $3, $4)',
                        [
                          spaceID,
                          senderUserID,
                          recipientUserName,
                          recipientUserID
                        ]
                      );
                    }).then(() => {
                      res.json({
                        success: true,
                        message: `${recipientUserName} has been invited to Space: ${spaceID}`
                      });
                    });
                  }
                });
            } else {
              res.json({ success: false, message: 'Username does not exist.' });
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
});


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
    'SELECT space_invites.space_invite_id, space_invites.space_id, spaces.space_name, space_invites.sender_user_id, users.first_name as sender_first_name,users.last_name as sender_last_name,space_invites.recipient_user_id FROM space_invites INNER JOIN spaces ON space_invites.space_id = spaces.space_id INNER JOIN users ON space_invites.sender_user_id = users.user_id WHERE recipient_user_id = $1 AND accepted = false',
    [userID]
  ).then((invites) => {
    res.json(invites);
  });
});

module.exports = router;
