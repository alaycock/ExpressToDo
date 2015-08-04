var express = require('express');
var router = express.Router();

/* Implements the logic for the RESTful interface
*/
var ToDo = function(requestSender) {

  /* Get all items from the database server
   */
  this.getAll = function(req, res) {
    requestSender.send('GET', '/', null,
      function onSuccess(server_res, body){
        sendResponse(res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while retrieving: ' + error);
      });
  };

  /* Add a new item to the database server
   * All fields must be set and valid or the request is rejected
   */
  this.post = function(req, res) {
    if(!validateNewItem(req, res)) return;

    var options = {
      form: {
        text: req.body.text,
        complete: req.body.complete
      }
    };

    requestSender.send('POST', '/', options,
      function onSuccess(server_res, body){
        sendResponse(res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while adding item: ' + error);
      });
  };

  /* Get an individual item from the database server
   */
  this.get = function(req, res) {
    var id = req.params.todo_id;

    requestSender.send('GET', '/' + id, null,
      function onSuccess(server_res, body){
        var errString = "Error occurred while retrieving: ";
        if(body == '')
          sendError(res, errString + "No element found");
        else
          sendResponse(res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while retrieving: ' + error);
      });
  };

  /* Update an item on the database server
   * Since this is a PUT, all fields must be provided per the REST standard
   * All the fields are validated prior to insertion
   */
  this.put = function(req, res) {
    var id = req.params.todo_id;

    if(!validateNewItem(req, res)) return;

    var options = {
      form: {
        text: req.body.text,
        complete: req.body.complete
      }
    };

    requestSender.send('PUT', '/' + id, options,
      function onSuccess(server_res, body){
        stubResponse(res, 'Result', 'Update successful');
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while updating: ' + error);
      });
  };

  /* Add a new item to the database server
   * All fields must be set and valid or the request is rejected
   */
  this.delete = function(req, res) {
    var id = req.params.todo_id;

    requestSender.send('DELETE', '/' + id, null,
      function onSuccess(server_res, body){
        stubResponse(res, 'Result', 'Deletion successful');
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while deleting: ' + error);
      });
  };

  var validateNewItem = function(req, res) {
    var errString;
    if(!req.body.text || !req.body.complete)
      errString = "One or more required parameters was missing";
    else if(req.body.complete.toLowerCase() != "false" && req.body.complete.toLowerCase() != "true")
      errString = "Value for complete is not 'true' or 'false'";

    if(errString) {
      sendError(res, errString);
      return false;
    }
    return true;
  }

  var sendError = function(res, errorString) {

    stubResponse(res, 'error', errorString);
  }

  var stubResponse = function(res, key, resString) {
    var toRet = {};
    toRet[key] = resString;
    sendResponse(res, toRet);
  }

  var sendResponse = function(out_res, data) {
    out_res.header('Content-Type', 'application/json');
    out_res.send(data);
  }

}

module.exports = ToDo;
