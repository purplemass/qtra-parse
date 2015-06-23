Parse.Cloud.define("getSecretKeyCC", function(request, response) {
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha1');

  Parse.Config.get().then(function(config) {
    var qsk = config.get("qtraSecretKey");
    qsk = crypto.createHash('sha1').update(qsk).digest("hex");
    response.success(qsk);
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.define("parseLoginCC", function(request, response) {
  var username = request.params.username
  var password = request.params.password;

  Parse.Cloud.run('getSecretKeyCC', {}, {
    success: function(result) {
      var qsk = result;
      var dataToSend = {
        'qsk': qsk,
        'username': username,
        'password': password
      };

      Parse.Cloud.run('testLoginWebHook', dataToSend, {
        success: function(result) {
          if (result.qsk === undefined) {
            response.error("missing key");
          } else if (result.qsk !== qsk) {
            response.error("incorrect key");
          } else if (result.data === undefined) {
            response.error("missing data");
          } else {
            var expirydate = new Date(result.data);
            var now = new Date();
            if (expirydate < now) {
              response.error("user expired");
            } else {
              response.success(result.data);
            }
          }
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
