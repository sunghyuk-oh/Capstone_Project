const router = express.Router();

router.post('/createSpace', (req, res) => {
  const { spaceName, userID } = req.body;

  db.none('INSERT INTO spaces (space_name, user_id) VALUES ($1, $2)', [
    spaceName,
    userID
  ])
    .then(() => {
      db.any('SELECT space_id FROM spaces where space_name = $1', [
        spaceName
      ]).then((space) => {
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
  const userName = req.body.userName;
  const spaceID = req.body.spaceID;

  db.any('SELECT space_name from spaces where space_id = $1', [spaceID]).then(
    (space) => {
      const spaceName = space[0].space_name;
      db.any('SELECT user_id from users where username = $1', [userName]).then(
        (user) => {
          const userID = user[0].user_id;
          db.none(
            'INSERT INTO spaces_invitees (space_id, user_id) VALUES($1, $2)',
            [spaceID, userID]
          ).then(
            res.json({
              success: true,
              message: `User ID: ${userID} has been invited to Space: ${spaceName}`
            })
          );
        }
      );
    }
  );
});

// authenticate space
router.get('/auth/:spaceID/:userID', (req, res) => {
  const spaceID = req.params.spaceID;
  const userID = req.params.userID;

  db.any('SELECT space_id from spaces where user_id=$1 group by space_id', [
    userID
  ]).then((userSpacesCreated) => {
    const createdSpaces = userSpacesCreated.map((space) => {
      return space.space_id;
    });
    db.any(
      'SELECT space_id from spaces_invitees where user_id=$1 group by space_id',
      [userID]
    ).then((userSpacesInvited) => {
      const invitedSpaces = userSpacesInvited.map((space) => {
        return space.space_id;
      });

      const allSpaces = createdSpaces.concat(invitedSpaces);

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
