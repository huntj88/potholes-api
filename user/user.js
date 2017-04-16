/**
 * Created by James on 4/12/2017.
 */
var express = require('express');
var jwt    = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();


//creates a new user
router.post('/create', function(req, res, next) {

    //hashes the password and salt it. save it in database;

    bcrypt.genSalt(10, function (error, salt) {
        bcrypt.hash(req.body.password, salt, null, function(err, hash) {

            var queryString = "INSERT INTO users (displayName, password) VALUES (?,?)";

            var mysqlPool = require("./../util/mysqlPool");
            mysqlPool.getConnection(function (err, connection) {
                connection.query(queryString, [req.body.displayName, hash], function (error, results, fields) {
                    if (error) {
                        throw error;
                    }
                    else {
                        res.json({
                            success: true
                        });
                        connection.release();
                    }
                });
            });


        });
    });
});


//provides a json web token for the user
router.post('/authenticate', function(req, res, next) {


    var mysqlPool = require('./../util/mysqlPool');

    var queryString = "select userID, password from users where displayName = ?";

    mysqlPool.getConnection(function (err, connection) {
        connection.query(queryString, [req.body.displayName], function (error, mysqlResults, fields) {

            connection.release();

            if (error) {
                throw error;
            }
            else if (mysqlResults.length == 1) {

                //makes sure the hash of the user supplied password matches the hash saved in the database
                bcrypt.compare(req.body.password, mysqlResults[0].password, function (err, bcryptResult) {

                    //if the hashes match then provide the user with a token. otherwise provide an error;
                    if (bcryptResult) {
                        var token = jwt.sign({userID: mysqlResults[0].userID}, req.app.get('potholeSecret'), {
                            expiresIn: '24h' // expires in 24 hours
                        });

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            token: token
                        });
                    }
                    else {
                        return res.status(403).send({
                            success: false,
                            message: 'invalid credentials'
                        });
                    }
                });
            }
            else
            {
                return res.status(403).send({
                    success: false,
                    message: 'invalid credentials'
                });
            }
        });
    });

});


module.exports = router;