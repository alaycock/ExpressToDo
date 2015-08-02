var RequestSender = function(request) {

  this.send = function(method, url, options, onSuccess, onError) {

    var res = {};
    var body = {key: 'value'};
    var error = 'test'

    if(url.indexOf('goodUrl') != -1)
      onSuccess(res, body);
    else
      onError(res, error);
  };
}

module.exports = RequestSender;
