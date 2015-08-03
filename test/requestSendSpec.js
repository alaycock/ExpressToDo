var expect      = require("chai").expect;
var assert      = require("chai").assert;
var RequestSend = require("../lib/requestSend");
var MockConfig  = require("./mockConfig");

describe("RequestSend", function(){
  describe("#send(method, path, options, onSuccess, onError)", function(){
    it("should generate a valid list of options from the config", function(){

      var optionsMatch = {
        method: 'GET',
        uri: 'goodUrl/',
        auth: {
          user: 'goodUsername',
          pass: 'goodPassword',
          sendImmediately: false
        }
      };

      var request = function(options, callback) {
        expect(options).to.deep.equal(optionsMatch);
      };

      var config = MockConfig;

      var requester = new RequestSend(request, config);
      requester.send("GET", '/', null, null, null);

    });

    it("should add and override custom options to the request", function(){
      var optionsMatch = {
        method: 'POST',
        uri: 'goodUrl/',
        auth: {
          user: 'goodUsername',
          pass: 'goodPassword',
          sendImmediately: false
        },
        key: "value"
      };

      var request = function(options, callback) {
        expect(options).to.deep.equal(optionsMatch);
      };

      var config = MockConfig;

      var requester = new RequestSend(request, config);
      requester.send("GET", '/', {key: "value", method: "POST"}, null, null);

    });

    it("should run the success callback", function(){

      var request = function(options, callback) {
        callback(null, "response", "body");
      };

      var onSuccess = function(res, body) {
        expect(res).to.equal("response");
        expect(body).to.equal("body");
      };
      var onFail = function(res, error) {
        assert.fail('', '', 'Failure callback executed')
      };

      var config = MockConfig;

      var requester = new RequestSend(request, config);
      requester.send("GET", '/', {key: "value", method: "POST"}, onSuccess, onFail);

    });

    it("should run the error callback", function(){

      var request = function(options, callback) {
        callback("error", "response", "body");
      };

      var onSuccess = function(res, body) {
        assert.fail('', '', 'Success callback executed');
      };
      var onFail = function(res, error) {
        expect(res).to.equal("response");
        expect(error).to.equal("error");
      };

      var config = MockConfig;

      var requester = new RequestSend(request, config);
      requester.send("GET", '/', {key: "value", method: "POST"}, onSuccess, onFail);

    });
  });
});
