/**
 * Created by James on 4/12/2017.
 */
var express = require('express');
var router = express.Router();

//this is a template i made so i can copy and paste it when i need to set up a new route.


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function (req, res) {
    res.send('Birds home page');
});
// define the about route
router.get('/about', function (req, res) {
    res.send('About birds');
});

module.exports = router;