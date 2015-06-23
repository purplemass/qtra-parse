Parse.initialize("GIm4OTBES61ztfbUQU4SVbb1rirVsws2k0aGV1c3", "KQ8r1LfoTmmd6OfTpPAPj32doxnP5US2gomGeGr3");

function parseLogin(username, password, deferred) {
  var dataToSend = {
    'username': username,
    'password': password
  };

  Parse.Cloud.run('parseLoginCC', dataToSend, {
    success: function(result) {
      logIt("parseLogin: success");
      if (result === false) {
        deferred.reject('Could not login');
        logIt("parseLogin: could not login");
      } else {
        logIt(result);
        parseLoginActual(username, password, deferred);
      }
    },
    error: function(error) {
      deferred.reject(error);
      logIt("parseLoginCC");
      logIt(error);
    }
  });
}

function parseLoginActual(username, password, deferred) {
  Parse.User.logIn(username, password, {
    success: function(result) {
      deferred.resolve('Welcome ' + username + '!');
    },
    error: function(error) {
      deferred.reject(error);
      logIt("parseLoginActual");
      response.error(error);
    }
  });
}

function parseLogout() {
  Parse.User.logOut();
  logIt("parseLogout: logged out");
}

function parseGetProjects(deferred) {
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

      deferred.resolve(results);

      // parseAddProject();
      // parseGetProject("jkWGgVrBjx"); // Bob's
      // parseGetProject("JXFFocBbB0"); // Pop's
      // parseGetProject("nneYfLDCd1"); // Oliver's
    },
    error: function(error) {
      logIt("parseGetProjects: error: " + error.code + " " + error.message);
    }
  });
}

function parseAddProject() {
  var ProjectObject = Parse.Object.extend("Project");
  var projectObject = new ProjectObject();

  projectObject.set("name", "ProjectBob3 Temp");
  projectObject.setACL(new Parse.ACL(Parse.User.current()));

  projectObject.save({user: Parse.User.current()}, {
    success: function(projectObject) {
      projectObject.set("description", "Some description");
      projectObject.save();
      logIt("parseAddProject: success");
    },
    error: function(error) {
      logIt("parseAddProject: error: " + error.code + " " + error.message);
    }
  });
}

function parseGetProject(uid) {
  var ProjectObject = Parse.Object.extend("Project");
  var query = new Parse.Query(ProjectObject);
  query.get(uid, {
    success: function(result) {
      logIt(result.attributes);
    },
    error: function(object, error) {
      logIt("parseGetProject: Error");
      logIt(error);
    }
  });
}

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

/*
      var currentUser = Parse.User.current();
      logIt("parseLoginActual: success");
      logIt("ID:" + currentUser.id);
      logIt("Current: " + currentUser._isCurrentUser);
      logIt(currentUser.attributes);
*/

// parseLogin('bob', 'bob', true);
// parseLogin('pop', 'pop', true);
// parseLogin('oliver', 'oliver', true);
