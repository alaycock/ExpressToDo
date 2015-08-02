var express = require('express');
var router = express.Router();
var config = require('../config');

/* Implements the logic for the RESTful interface
*/
var ToDo = function(requestSender) {

  /* Get all items from the database server
   */
  this.getAll = function(req, res) {
    requestSender.send('GET', config.server_url + '/', null,
      function onSuccess(server_res, body){
        sendResponse(res, server_res, body);
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
        order: req.body.order,
        text: req.body.text,
        color: req.body.color,
        complete: req.body.complete
      }
    };

    requestSender.send('POST', config.server_url + '/', options,
      function onSuccess(server_res, body){
        sendResponse(res, server_res, body);
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while adding item: ' + error);
      });
  };

  /* Get an individual item from the database server
   */
  this.get = function(req, res) {
    var id = req.params.todo_id;

    requestSender.send('GET', config.server_url + '/' + id, null,
      function onSuccess(server_res, body){
        sendResponse(res, server_res, body);
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
        order: req.body.order,
        text: req.body.text,
        color: req.body.color,
        complete: req.body.complete
      }
    };

    requestSender.send('PUT', config.server_url + '/' + id, options,
      function onSuccess(server_res, body){
        sendResponse(res, server_res, body);
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

    requestSender.send('DELETE', config.server_url + '/' + id, null,
      function onSuccess(server_res, body){
        stubResponse(res, 'Result', 'Deletion successful');
      },
      function onError(server_res, error) {
        sendError(res, 'Error occurred while deleting: ' + error);
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

  var sendError = function(res, errorString) {
    stubResponse(res, 'error', errorString);
  }

  var stubResponse = function(res, key, resString) {
    sendResponse({key: resString});
  }

  var sendResponse = function(out_res, data) {
    out_res.header('Content-Type', 'application/json');
    out_res.send(data);
  }

}

module.exports = ToDo;
