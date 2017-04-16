/**
 * Created by James on 4/12/2017.
 */
var express = require('express');
var router = express.Router();
var jwtCheckAuth = require('./../jwtCheckAuth');


// anything before this can access be access without a json web token
router.use(jwtCheckAuth);
// anything past this point must have a valid json web token

// gets the potsholes around a certain coordinate
router.get('/location', function (req, res) {
    var xCord = parseInt(req.query.x);
    var yCord = parseInt(req.query.y);

    var radius = 10;

    var rlon1 = xCord - (radius * 2) / Math.abs(Math.cos(yCord * Math.PI / 180) * 69);
    var rlon2 = xCord + (radius * 2) / Math.abs(Math.cos(yCord * Math.PI / 180) * 69);
    var rlat1 = yCord - ((radius * 2) / 69);
    var rlat2 = yCord + ((radius * 2) / 69);


    console.log(rlon1+" "+rlat1+" "+rlon2+" "+rlat2+" ");

    var queryString = "SELECT * FROM potholes WHERE st_within(location, envelope(linestring(point(?, ?), point(?, ?))))";


    var mysqlPool = require("./../util/mysqlPool");
    mysqlPool.getConnection(function (err, connection) {
        connection.query(queryString, [rlon1, rlat1, rlon2, rlat2], function (error, results, fields) {
            if (error) {
                throw error;
            }
            else {
                res.send(results);
                connection.release();
            }
        });
    });

});

// gets all the potholes in the database
router.get('/all', function (req, res) {


    var queryString = "SELECT * FROM potholes";


    var mysqlPool = require("./../util/mysqlPool");
    mysqlPool.getConnection(function (err, connection) {
        connection.query(queryString, [], function (error, results, fields) {
            if (error) {
                throw error;
            }
            else {
                res.send(results);
                connection.release();
            }
        });
    });

});


// gets a pothole by the id.
// example would be:    /pothole/2  to get pothole with id 2
router.get('/:potholeID', function (req, res) {

    var queryString = "SELECT * FROM potholes WHERE potholeID = ?";

    var mysqlPool = require("./../util/mysqlPool");
    mysqlPool.getConnection(function (err, connection) {
        connection.query(queryString, [req.params.potholeID], function (error, results, fields) {
            if (error) {
                throw error;
            }
            else {
                res.send(results[0]);
                connection.release();
            }
        });
    });
});

// api endpoint to add potholes
router.post('/add',function (req,res) {

    var point = 'POINT('+req.body.x+' '+req.body.y+')';
    var queryString = "INSERT INTO potholes(userID, location) VALUES (?,ST_GeomFromText(?))";

    // gets userID from jwt.
    // jwt is decoded in jwtCheckAuth and saved in req.decoded.userID

    var userID = req.decoded.userID;

    console.log("test");
    var mysqlPool = require("./../util/mysqlPool");
    mysqlPool.getConnection(function (err, connection) {
        connection.query(queryString, [userID,point], function (error, results, fields) {
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

module.exports = router;