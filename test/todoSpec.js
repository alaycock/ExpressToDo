var expect     = require("chai").expect;
var ToDo       = require("../lib/todo");
var MockSender = require("./mockRequestSend");

describe("ToDo", function(){
  describe("#getAll(req, res)", function(){
    it("should respond with all items from the database", function(){

      var mockRequester = new MockSender(true);
      var todo = new ToDo(mockRequester);

      var req = {};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("key", "value");
      };
      todo.getAll(req, res);

    });

    it("should respond with an error message from the database", function(){

      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester);

      var req = {};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Error occurred while retrieving: test");
      };
      todo.getAll(req, res);

    });
  });

  describe("#post(req, res)", function(){
    it("should respond with a single new item from the database", function(){

      var mockRequester = new MockSender(true);
      var todo = new ToDo(mockRequester);

      var req = {};
      req.body = {};
      req.body.text = "test";
      req.body.complete = "true";

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("key", "value");
      };
      todo.post(req, res);
    });

    it("should respond with an invalid complete status error", function(){
      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester);

      var req = {
        body: {
          text: 'test',
          complete: 'blurb'
      }};

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Value for complete is not 'true' or 'false'");
      };
      todo.post(req, res);
    });

    it("should respond with a missing property error", function(){
      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester);

      var req = {
        body: {
          text: 'test',
      }};

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "One or more required parameters was missing");
      };
      todo.post(req, res);
    });

  });

  describe("#get(req, res)", function(){
    it("should respond with a single item from the database", function(){

      var mockRequester = new MockSender(true);
      var todo = new ToDo(mockRequester);

      var req = {params: {todo_id: 1}};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("key", "value");
      };
      todo.get(req, res);

    });

    it("should respond with an error message from the database", function(){

      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester);

      var req = {params: {todo_id: 1}};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Error occurred while retrieving: test");
      };
      todo.get(req, res);

    });
  });

  describe("#put(req, res)", function(){
    it("should respond with a single new item from the database", function(){

      var mockRequester = new MockSender(true);
      var todo = new ToDo(mockRequester);

      var req = {
        body: {
          text: 'test',
          complete: 'true'},
        params: {
          todo_id: 1
        }};

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("Result", "Update successful");
      };
      todo.put(req, res);

    });

    it("should respond with an error message from the database", function(){
      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester);

      var req = {
        body: {
          text: 'test',
          complete: 'true'},
        params: {
          todo_id: 1
        }};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Error occurred while updating: test");
      };
      todo.put(req, res);
    });

    it("should respond with a validation error", function(){

      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester);

      var req = {
        body: {
          text: 'test'
        },
        params: {
          todo_id: 1
        }};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "One or more required parameters was missing");
      };
      todo.put(req, res);
    });
  });

  describe("#delete(req, res)", function(){
    it("should respond with a single item from the database", function(){

      var mockRequester = new MockSender(true);
      var todo = new ToDo(mockRequester);

      var req = {params: {todo_id: 1}};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("Result", "Deletion successful");
      };
      todo.delete(req, res);

    });

    it("should respond with an error message from the database", function(){

      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester);

      var req = {params: {todo_id: 1}};
      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Error occurred while deleting: test");
      };
      todo.delete(req, res);

    });
  });

});
