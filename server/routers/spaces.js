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
          spaceID: space[0].space_id
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

  db.any('SELECT user_id from users where username = $1', [
    recipientUserName
  ]).then((user) => {
    const recipientUserID = user[0].user_id;
    db.none(
      'INSERT INTO space_invites (space_id, sender_user_id, recipient_user_id) VALUES($1, $2)',
      [spaceID, senderUserID, recipientUserID]
    ).then(
      res.json({
        success: true,
        message: `User ID: ${recipientUserID} has been invited to Space: ${spaceID}`
      })
    );
  });
});

// authenticate space
router.get('/auth/:spaceID/:userID', (req, res) => {
  const spaceID = req.params.spaceID;
  const userID = req.params.userID;

  db.any(
    'SELECT space_id from space_members where user_id=$1 group by space_id',
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
    'SELECT username, first_name, last_name from users inner join spaces on users.user_id = spaces.user_id where spaces.space_id = $1',
    [spaceID]
  ).then((spaceCreator) => {
    db.any(
      'SELECT distinct username, first_name, last_name from users inner join spaces_invitees on users.user_id = spaces_invitees.user_id where spaces_invitees.space_id = $1',
      [spaceID]
    ).then((spaceInvitee) => {
      const allMembers = spaceCreator.concat(spaceInvitee);

      res.json({ success: true, members: allMembers });
    });
  });
});

router.get('/viewSpace/:userID', authenticate, (req, res) => {
  const { userID } = req.params;

  db.any(
    'SELECT space_id, space_name, user_id from spaces where user_id = $1 group by space_id',
    [userID]
  ).then((foundSpaces) => {
    res.json(foundSpaces);
  });
});

module.exports = router;
