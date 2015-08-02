var expect        = require("chai").expect;
var ToDo          = require("../lib/todo");
var MockSender    = require("./mockRequestSend");
var MockConfig    = require("./mockConfig");

describe("ToDo", function(){
  describe("#getAll(req, res)", function(){
    it("should respond with all items from the database", function(){

      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester, MockConfig.goodConfig);

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
      var todo = new ToDo(mockRequester, MockConfig.badConfig);

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

      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester, MockConfig.goodConfig);

      var req = {};
      req.body = {};
      req.body.order = 1;
      req.body.text = "test";
      req.body.color = "#FFFFFF";
      req.body.complete = "true";

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        console.log(res_data);
        expect(res_data).to.have.a.property("key", "value");
      };
      todo.post(req, res);
    });

    it("should respond with an invalid colour error", function(){
      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester, MockConfig.goodConfig);

      var req = {};
      req.body = {};
      req.body.order = 1;
      req.body.text = "test";
      req.body.color = "#FFFFFG";
      req.body.complete = "true";

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Color does not match the hex format #FFFFFF");
      };
      todo.post(req, res);
    });

    it("should respond with an invalid order error", function(){
      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester, MockConfig.goodConfig);

      var req = {};
      req.body = {};
      req.body.order = -1;
      req.body.text = "test";
      req.body.color = "#FFFFFF";
      req.body.complete = "true";

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Order is not a valid non-negative integer");
      };
      todo.post(req, res);
    });

    it("should respond with an invalid complete status error", function(){
      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester, MockConfig.goodConfig);

      var req = {};
      req.body = {};
      req.body.order = 1;
      req.body.text = "test";
      req.body.color = "#FFFFFF";
      req.body.complete = "blurb";

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "Value for complete is not 'true' or 'false'");
      };
      todo.post(req, res);
    });

    it("should respond with a missing property error", function(){
      var mockRequester = new MockSender();
      var todo = new ToDo(mockRequester, MockConfig.goodConfig);

      var req = {};
      req.body = {};
      req.body.order = 1;
      req.body.text = "test";
      req.body.color = "#FFFFFF";

      var res = {};
      res.header = function(key, val) { };
      res.send = function(res_data) {
        expect(res_data).to.have.a.property("error", "One or more required parameters was missing");
      };
      todo.post(req, res);
    });

  });
});
