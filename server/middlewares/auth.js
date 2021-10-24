function authenticate(req, res, next) {
    
    let headers = req.headers['authorization']

    if (headers) {
        const token = headers.split(' ')[1]
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`)

        if(decoded) {
            const username = decoded.username

            db.any('SELECT username FROM users WHERE username=$1', [username])
            .then(authUser => {
                if (authUser.length > 0) {
                    next()
                } else {
                    res.redirect('http://gather.surge.sh/')
                }
            })
        } else {
            res.redirect('http://gather.surge.sh/')
        }
    } else {
        res.redirect('http://gather.surge.sh/')
    }
}

module.exports = authenticate