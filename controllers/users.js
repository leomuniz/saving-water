const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const permissions = require("../config/permissions")

module.exports = {

    authorize: (req, res, next) => {
        User.findOne({ login: req.body.login }, function (err, user) {
            if (err) throw err;

            if (user) {
                bcrypt.compare(req.body.password, user.password, function(err, validPassword) {
                    if (validPassword) {
                        var token = jwt.sign({ login: user.login, role: user.role }, sysvar.jwtSecret);
                        
                        // return the information including token as JSON
                        res.json({
                            success: true,
                            user: user.login,
                            token: token
                        });
                    } else {
                        // invalid password
                        res.json({ success: false, message: "Your login or password is invalid. Please try again." });
                    }
                });                
            } else {
                // invalid user
                res.json({ success: false, message: "Your login or password is invalid. Please try again." });
            }
        });

        return
    },

    verifyToken: (req, res, next) => {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, sysvar.jwtSecret, function (err, user) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.', token:token });
                } else {
                    
                    var endpoint = req._parsedUrl.pathname.replace(/\//g,'');
                    if (permissions.verify(user.role, endpoint, req.method)) {
                        req.user = user;
                        next()
                    } else {
                        res.json({ success: false, message: 'Access unauthorized.' })
                        return
                    }
                }
            });

        } else {

            // if there is no token return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }

}