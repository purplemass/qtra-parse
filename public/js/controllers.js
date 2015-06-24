'use strict';

angular.module('qtraApp.controllers', [])

.controller('LoginController', function($scope, $state, LoginService, $ionicPopup, $ionicHistory) {
  console.log('LoginController');
  $scope.data = {};

  $scope.login = function() {
    LoginService.loginUser($scope.data.username, $scope.data.password)
      .success(function(data) {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go('tab.projects');
        $ionicHistory.clearHistory();
      })
      .error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed',
          template: 'Please check your credentials'
      });
    });
  }
})

.controller('ProjectsController', function($scope, RedirectService, ProjectService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('ProjectsController');

  ProjectService.parseLoad().then(function(promise) {
    $scope.projects = promise;
  });

  $scope.remove = function(project) {
    ProjectService.remove(project);
  }
})

.controller('ProjectDetailController', function($scope, $stateParams, RedirectService, ProjectService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('ProjectDetailController');

  parseGetProjects();
  $scope.project = ProjectService.get($stateParams.projectId);
})

.controller('TreeDetailController', function($scope, $stateParams, RedirectService, ProjectService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('TreeDetailController');

  $scope.project = ProjectService.get($stateParams.projectId);
  $scope.tree = $scope.project.trees[$stateParams.treeId];
})

.controller('AccountController', function($scope, $state, RedirectService, LoginService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('AccountController');

  $scope.$on('$ionicView.enter', function() {
    $scope.loggeduser = LoginService.getUser();
  });

  $scope.logout = function() {
    parseLogout();
  }
})

.controller('LogoutController', function($scope, $state, RedirectService, $ionicPopup, $ionicHistory) {
  console.log('LogoutController');

  $scope.backToLogin = function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go('login', false);
    $ionicHistory.clearHistory();
  }
});

/*
Check current url:
   if ($state.current.url != '/account') {

Watch for a scope change:
    $scope.loggeduser = LoginService.getUser();

    // must watch this!
    // it's an angular thing:
    // http://stsc3000.github.io/blog/2013/10/26/a-tale-of-frankenstein-and-binding-to-service-values-in-angular-dot-js/
    //
    $scope.$watch(
      function(){ return LoginService.getUser() },
      function(newVal) {
        console.log(newVal);
        $scope.loggeduser = newVal;
      }
    )
*/