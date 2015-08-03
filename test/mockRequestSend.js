var RequestSender = function(isSuccess) {

  this.send = function(method, path, options, onSuccess, onError) {

    var res = {};
    var body = {key: 'value'};
    var error = 'test'
    if(isSuccess)
      onSuccess(res, body);
    else
      onError(res, error);
  };
}

module.exports = RequestSender;
