/**
 * Created by James on 4/12/2017.
 */
var express = require('express');
var jwt    = require('jsonwebtoken');
var router = express.Router();


//this is just a filter to check if you have a valid access token wherever you use it in your code.

router.use(function(req, res, next) {

    console.log(req.headers);
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['access-token'];

    // decode token
    if (token) {

        // verifies jwt is a valid one that is not expired
        jwt.verify(token, req.app.get('potholeSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log(req.decoded);
                next();
            }
        });

    } else {

        // if there is no token
        // return an error

        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

module.exports = router;