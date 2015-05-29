function logIt(str) {
  if (typeof str === 'object') {
    var myObj = jQuery.makeArray(str)[0];
    str = "";
    for(var i in myObj) {
      str += i + " = " + myObj[i] + "<br>";
    }
  } else {
    str = str + "<br>";
  }

  var debug = $("#debugPanel");
  var ret = str;
  ret += "------------------------------------------------------------------<br>";
  ret += debug.html();
  debug.html(ret);
}

Parse.initialize("GIm4OTBES61ztfbUQU4SVbb1rirVsws2k0aGV1c3", "KQ8r1LfoTmmd6OfTpPAPj32doxnP5US2gomGeGr3");

function parseLogin(username, password, listProjects) {
  var data_to_send = {
    'username': username,
    'password': password
  };

  Parse.Cloud.run('parseLoginCC', data_to_send, {
    success: function(result) {
      logIt("parseLogin: success");
      logIt(result);
      if (result !== false) {
        parseLoginActual(username, password, listProjects);
      } else {
        logIt("parseLogin: could not login to qtra.co.uk");
      }
    },
    error: function(error) {
      logIt("parseLogin: got error!");
      logIt(error);
    }
  });
}

function parseLoginActual(username, password, listProjects) {
  Parse.User.logIn(username, password, {
    success: function(result) {
      var currentUser = Parse.User.current();
      logIt("parseLoginActual: success");
      // logIt("ID:" + result.id);
      // logIt("Current: " + result._isCurrentUser);
      // logIt(result.attributes);
      if (listProjects) {
        parseGetProjects();
      }
    },
    error: function(result, error) {
      response.error(error);
    }
  });
}

function parseLogout() {
  logIt("parseLogout: logged out");
  Parse.User.logOut();
}

function parseGetProjects() {
  var ProjectObject = Parse.Object.extend("Project");
  var query = new Parse.Query(ProjectObject);
  var user = Parse.User.current();
  query.equalTo("user", user);
  query.find({
    success: function(results) {
      logIt("parseGetProjects: successfully retrieved " + results.length + " projects.");
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        logIt(object.get('name'));
      }
      // parseAddProject();
    },
    error: function(error) {
      logIt("parseGetProjects: error: " + error.code + " " + error.message);
    }
  });
}

function parseAddProject() {
  var ProjectObject = Parse.Object.extend("Project");
  var projectObject = new ProjectObject();
  var user = Parse.User.current();

  projectObject.set("name", "ProjectBob3 Temp");
  projectObject.set("user", user);
  projectObject.setACL(new Parse.ACL(Parse.User.current()));

  projectObject.save(null, {
    success: function(projectObject) {
      logIt("parseAddProject: success");
      // Now let's update it with some new data. In this case, only cheatMode and score
      // will get sent to the cloud. playerName hasn't changed.
      // gameScore.set("cheatMode", true);
      // gameScore.set("score", 1338);
      // gameScore.save();
    },
    error: function(error) {
      logIt("parseAddProject: error: " + error.code + " " + error.message);
    }
  });

}

// query.get("xWMyZ4YEGZ", {
//   success: function(gameScore) {
//     logIt(gameScore);
//     // The object was retrieved successfully.
//   },
//   error: function(object, error) {
//     logIt("Parse: Error");
//     // The object was not retrieved successfully.
//     // error is a Parse.Error with an error code and message.
//   }
// });
// var testObject = new TestObject();
// testObject.save({foo: "oliver"}, {
//   success: function(object) {
//     $(".success").show();
//   },
//   error: function(model, error) {
//     $(".error").show();
//       logIt("Parse: ERROR!");
//   }
// });

// parseGetProjects();

parseLogin('bob', 'bob1', true);
// parseLogin('pop', 'pop', true);
// parseLogin('oliver', 'oliver', true);

