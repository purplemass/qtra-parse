angular.module('qtra.controllers', [])

.controller('LoginController', function($scope, $state, LoginService, $ionicPopup, $ionicHistory) {
  $scope.data = {};

  var logUserIn = function() {
    $scope.loggeduser = LoginService.getUser();
    // must watch this!
    // it's an angular thing:
    // http://stsc3000.github.io/blog/2013/10/26/a-tale-of-frankenstein-and-binding-to-service-values-in-angular-dot-js/
    //
    $scope.$watch(
      function(){ return LoginService.getUser() },
      function(newVal) {
        $scope.loggeduser = newVal;
      }
    )

    // this is very bad as we have hard-coded route!!
    // must replace
    //
    if ($state.current.url != '/account') {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('tab.projects');
      $ionicHistory.clearHistory();
    }
  }

  if (LoginService.isLoggedIn() === true) {
    logUserIn();
  }

  $scope.login = function() {
    LoginService.loginUser($scope.data.username, $scope.data.password)
      .success(function(data) {
        logUserIn();
      })
      .error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
      });
    });
  }

  $scope.logout = function() {
    parseLogout();
    LoginService.clearUser();
  }

  $scope.backToLogin = function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go('login', false);
    $ionicHistory.clearHistory();
  }
})

.controller('ProjectsController', function($scope, ProjectService) {
  ProjectService.load().then(function(promise) {
    $scope.projects = promise;
  });

  $scope.remove = function(project) {
    ProjectService.remove(project);
  }
})

.controller('ProjectDetailController', function($scope, $stateParams, ProjectService) {
  parseGetProjects();
  $scope.project = ProjectService.get($stateParams.projectId);
})

.controller('TreeDetailController', function($scope, $stateParams, ProjectService) {
  $scope.project = ProjectService.get($stateParams.projectId);
  $scope.tree = $scope.project.trees[$stateParams.treeId];
})
