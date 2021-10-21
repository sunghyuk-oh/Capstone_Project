const router = express.Router();


router.get('/displayAllPosts/:spaceID', (req, res) => {
    const { spaceID } = req.params

    db.any('SELECT users.user_id, users.username, users.first_name, users.last_name, posts.post_id, posts.body_text, posts.date_created, COUNT(DISTINCT likes.like_id) AS like, COUNT(DISTINCT comments.comment_id) AS comment FROM posts LEFT JOIN likes ON likes.post_id = posts.post_id LEFT JOIN comments ON comments.post_id = posts.post_id INNER JOIN users ON users.user_id = posts.user_id WHERE posts.space_id = $1 GROUP BY posts.post_id, users.user_id ORDER BY posts.post_id ASC', [spaceID])
    .then((allPosts) => {
        res.json({success: true, allPosts: allPosts})
    })
})


router.post('/savePost', (req, res) => {
    const { spaceID, userID, bodyText } = req.body

    db.none('INSERT INTO posts (body_text, user_id, space_id) VALUES ($1, $2, $3)', [bodyText, userID, spaceID])
    .then(() => {
        db.any('SELECT users.user_id, users.username, users.first_name, users.last_name, posts.post_id, posts.body_text, posts.date_created, COUNT(DISTINCT likes.like_id) AS like, COUNT(DISTINCT comments.comment_id) AS comment FROM posts LEFT JOIN likes ON likes.post_id = posts.post_id LEFT JOIN comments ON comments.post_id = posts.post_id INNER JOIN users ON users.user_id = posts.user_id WHERE posts.space_id = $1 GROUP BY posts.post_id, users.user_id ORDER BY posts.post_id ASC', [spaceID])
        .then((allPosts) => {
            res.json({success: true, allPosts: allPosts})
        })
    })
})

router.get('/DisplayAllComments/:postID', (req, res) => {
    const { postID } = req.params

    db.any('SELECT users.username, users.first_name, users.last_name, comments.comment_id, comments.body_text, comments.date_created FROM comments INNER JOIN users on users.user_id = comments.user_id WHERE comments.post_id = $1 ORDER BY comments.comment_id ASC', [postID])
    .then(allComments => {
        res.json({ success: true, allComments: allComments })
    })
})

router.post('/saveAndDisplayComments', (req, res) => {
    const { userID, postID, bodyText, spaceID } = req.body

    db.none('INSERT INTO comments (body_text, post_id, user_id) VALUES ($1, $2, $3)', [bodyText, postID, userID])
    .then(() => {
        db.any('SELECT users.username, users.first_name, users.last_name, comments.comment_id, comments.body_text, comments.date_created FROM comments INNER JOIN users on users.user_id = comments.user_id WHERE comments.post_id = $1 ORDER BY comments.comment_id ASC', [postID])
        .then((allComments) => {
            db.any('SELECT users.user_id, users.username, users.first_name, users.last_name, posts.post_id, posts.body_text, posts.date_created, COUNT(DISTINCT likes.like_id) AS like, COUNT(DISTINCT comments.comment_id) AS comment FROM posts LEFT JOIN likes ON likes.post_id = posts.post_id LEFT JOIN comments ON comments.post_id = posts.post_id INNER JOIN users ON users.user_id = posts.user_id WHERE posts.space_id = $1 GROUP BY posts.post_id, users.user_id ORDER BY posts.post_id ASC', [spaceID])
        .then((allPosts) => {
            res.json({success: true, comments: allComments, allPosts: allPosts})
        })
        })
    })
})
// res.json({ success: true, comments: allComments })

router.post('/incrementLike', (req, res) => {
    const { postID, spaceID } = req.body

    db.none('INSERT INTO likes (post_id) VALUES ($1)', [postID])
    .then(() => {
        db.any('SELECT users.user_id, users.username, users.first_name, users.last_name, posts.post_id, posts.body_text, posts.date_created, COUNT(DISTINCT likes.like_id) AS like, COUNT(DISTINCT comments.comment_id) AS comment FROM posts LEFT JOIN likes ON likes.post_id = posts.post_id LEFT JOIN comments ON comments.post_id = posts.post_id INNER JOIN users ON users.user_id = posts.user_id WHERE posts.space_id = $1 GROUP BY posts.post_id, users.user_id ORDER BY posts.post_id ASC', [spaceID])
        .then((allPosts) => {
            res.json({success: true, allPosts: allPosts})
        })
    })
})

module.exports = router;

