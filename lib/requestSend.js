var RequestSender = function(request, config) {

  /* Fire the request to the server specified in the environment
   */
  this.send = function(method, path, options, onSuccess, onError) {
    var reqOptions = {
      method: method,
      uri: config.server_url + path,
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

    request(reqOptions, function(error, response, body) {
      if(error)
        onError(response, error);
      else {
        onSuccess(response, body);
      }
    });
  };
}

module.exports = RequestSender;
