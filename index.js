var express = require('express');
var bodyParser = require('body-parser');
var pothole = require('./pothole/pothole');
var user = require('./user/user');

var app = express();

app.set('port', (process.env.PORT || 3000));
app.set('potholeSecret','PotholesBad123');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//anything to do with users
app.use('/user',user);

//anything to do with potholes
app.use('/pothole',pothole);

app.get('/', function(request, response) {
  response.send('potholes API');
});

app.listen(app.get('port'), function() {
  console.log("Potholes is running at localhost:" + app.get('port'));
});
