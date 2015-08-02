var express    = require('express');
var bodyParser = require('body-parser');
var todo       = require('./todo');
var app        = express();

// Helps parse the body of POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from public directory
app.get('/', express.static('public'));

// For any API paths, route them to the API
app.use('/todo', todo);

// Run the server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
