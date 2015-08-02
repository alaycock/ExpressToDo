var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('./config');

var ToDo = function() {
  
  this.getAll = function(req, res) {
    sendRequest('GET', config.server_url + '/', null,
      function onSuccess(server_res, body){
        forwardResponse(res, server_res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while retrieving: ' + error);
      });
  };

  this.post = function(req, res) {
    if(!validateNewItem(req, res)) return;

    var options = {
      form: {
        order: req.body.order,
        text: req.body.text,
        color: req.body.color,
        complete: req.body.complete
      }
    };

    sendRequest('POST', config.server_url + '/', options,
      function onSuccess(server_res, body){
        forwardResponse(res, server_res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while adding item: ' + error);
      });
  };

  this.get = function(req, res) {
    var id = req.params.todo_id;

    sendRequest('GET', config.server_url + '/' + id, null,
      function onSuccess(server_res, body){
        forwardResponse(res, server_res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while retrieving: ' + error);
      });
  };

  this.put = function(req, res) {
    var id = req.params.todo_id;

    if(!validateNewItem(req, res)) return;

    var options = {
      form: {
        order: req.body.order,
        text: req.body.text,
        color: req.body.color,
        complete: req.body.complete
      }
    };

    sendRequest('PUT', config.server_url + '/' + id, options,
      function onSuccess(server_res, body){
        forwardResponse(res, server_res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while updating: ' + error);
      });
  };

  this.delete = function(req, res) {
    var id = req.params.todo_id;

    sendRequest('DELETE', config.server_url + '/' + id, null,
      function onSuccess(server_res, body){
        stubResponse(res, 'Result', 'Deletion successful');
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while deleting: ' + error);
      });
  };

  var sendRequest = function(method, url, options, onSuccess, onError) {
    var reqOptions = {
      method: method,
      uri: url,
      auth: {
        user: config.server_username,
        pass: config.server_password,
        sendImmediately: false
      }
    };

    // Include any additional options, or override existing ones
    for(var key in options){
      reqOptions[key] = options[key];
    }

    console.log(reqOptions);

    request(reqOptions, function(error, response, body) {
      if(error)
        onError(response, error);
      else {
        onSuccess(response, body);
      }
    });
  };

  var validateNewItem = function(req, res) {
    var errString;
    if(!req.body.order || !req.body.text || !req.body.color || !req.body.complete)
      errString = "One or more required parameters was missing";
    else if(isNaN(req.body.order) || req.body.order < 0)
      errString = "Order is not a valid non-negative integer";
    else if(/^#[0-9a-f]{6}$/i.test(req.body.color.toLowerCase()))
      errString = "Color does not match the hex format #FFFFFF";
    else if(req.body.complete.toLowerCase() != "false" || req.body.complete.toLowerCase() != "true")
      errString = "Value for complete is not 'true' or 'false'";

    if(errString) {
      sendError(res, errString);
      return false;
    }
    return true;
  }

  var forwardResponse = function(out_res, server_res, data) {
    out_res.header('Content-Type', 'application/json');
    out_res.send(data);
  }

  var sendError = function(res, errorString) {
    stubResponse(res, 'error', errorString);
  }

  var stubResponse = function(res, key, resString) {
    res.header('Content-Type', 'application/json');
    res.send({key: resString});
  }

}

function init() {
  var todo = new ToDo();
  router
    .get('/', todo.getAll)
    .post('/', todo.post)
    .get('/:todo_id', todo.get)
    .put('/:todo_id', todo.put)
    .delete('/:todo_id', todo.delete);

  module.exports = router;
}
init();
