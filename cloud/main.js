Parse.Cloud.define("getSecretKeyCC", function(request, response) {
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha1');

  Parse.Config.get().then(function(config) {
    var qtraSecretKey = config.get("qtraSecretKey");
    qtraSecretKey = crypto.createHash('sha1').update(qtraSecretKey).digest("hex");
    response.success(qtraSecretKey);
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.define("parseLoginCC", function(request, response) {
  var username = request.params.username
  var password = request.params.password;

  Parse.Cloud.run('getSecretKeyCC', {}, {
    success: function(result) {
      var data_to_send = {
        'qtraSecretKey': result,
        'username': username,
        'password': password
      };

      Parse.Cloud.run('testLoginWebHook', data_to_send, {
        success: function(result) {
          response.success(result);
        },
        error: function(error) {
          response.error(error);
        }
      });

    },
    error: function(error) {
      response.error(error);
    }
  });
});
