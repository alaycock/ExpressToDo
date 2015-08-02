var express    = require('express');
var bodyParser = require('body-parser');
var request    = require('request');
var ToDo       = require('./lib/todo');
var Sender     = require('./lib/requestSend');
var app        = express();
var router     = express.Router();

// Helps parse the body of POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from public directory
app.get('/', express.static('public'));

// For any /todo paths, route them to the todo API
var todo = new ToDo(new Sender(request));
router.get('/', todo.getAll)
      .post('/', todo.post)
      .get('/:todo_id', todo.get)
      .put('/:todo_id', todo.put)
      .delete('/:todo_id', todo.delete);

app.use('/todo', router);

// Run the server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
