angular.module('qtra.services', [])

.service('LoginService', function($q, $localstorage) {

  return {
    loginUser: function(username, password) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      parseLogin(username, password, deferred);

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },
    isLoggedIn: function() {
      if ($localstorage.get('loggedin') === "true") {
        return true;
      } else {
        return false;
      }
    },
    getUser: function() {
      console.log("getUser");
      console.log(Parse.User.current());
      return Parse.User.current();
      // return $localstorage.get('user');
    }
    // clearUser: function() {
    //   $localstorage.set('loggedin', "");
    //   $localstorage.set('user', "");
    // }
  }
})

.service('ProjectService', function($q, $http) {
  var projectsURL = 'js/data/projects.json';
  var projects = [];

  return {
    all: function() {
      return projects;
    },
    remove: function(project) {
      projects.splice(projects.indexOf(project), 1);
    },
    get: function(projectId) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(projectId)) {
          return projects[i];
        }
      }
      return null;
    },
    load: function() {
      return $http.get(projectsURL).then(function(response) {
        if (typeof response.data === 'object') {
          projects = response.data;
          return projects;
        } else {
          return $q.reject(response.data);
        }
      }, function(error) {
        console.log('ERROR', error);
        return $q.reject(error);
      });
    }
  };
});
