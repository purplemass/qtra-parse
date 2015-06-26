'use strict';

var LoginController = function($scope, $changeState, LoginService, $ionicPopup) {
  console.log('LoginController');
  $scope.data = {};

  if (LoginService.isLoggedIn()) {
    $changeState.go('tab.projects');
  }

  $scope.login = function() {
    LoginService.loginUser($scope.data.username, $scope.data.password)
      .success(function(data) {
        $changeState.go('tab.projects');
      })
      .error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed',
          template: 'Please check your credentials'
      });
    });
  }
}

LoginController.$inject = ['$scope','$changeState','LoginService','$ionicPopup'];


var ProjectsController = function($scope, RedirectService, ProjectService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('ProjectsController');

  ProjectService.parseLoad().then(function(promise) {
    $scope.projects = promise;
  });

  $scope.remove = function(project) {
    ProjectService.remove(project);
  }
}

ProjectsController.$inject = ['$scope','RedirectService','ProjectService']


var ProjectDetailController = function($scope, $stateParams, RedirectService, ProjectService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('ProjectDetailController');

  parseGetProjects();
  $scope.project = ProjectService.get($stateParams.projectId);
}

ProjectDetailController.$inject = ['$scope','$stateParams','RedirectService','ProjectService']


var TreeDetailController = function($scope, $stateParams, RedirectService, ProjectService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('TreeDetailController');

  $scope.project = ProjectService.get($stateParams.projectId);
  $scope.tree = $scope.project.trees[$stateParams.treeId];
}

TreeDetailController.$inject = ['$scope', '$stateParams', 'RedirectService', 'ProjectService']


var AccountController = function($scope, RedirectService, LoginService) {
  if ( ! RedirectService.isLoggedIn()) return false;
  console.log('AccountController');

  $scope.$on('$ionicView.enter', function() {
    $scope.loggeduser = LoginService.getUser();
  });

  $scope.logout = function() {
    parseLogout();
  }
}

AccountController.$inject = ['$scope', 'RedirectService', 'LoginService']


var LogoutController = function($scope, $changeState) {
  console.log('LogoutController');

  $scope.backToLogin = function() {
    $changeState.go('login');
  }
}

LogoutController.$inject = ['$scope', '$changeState'];


angular
  .module('qtraApp.controllers', [])
  .controller('LoginController', LoginController)
  .controller('ProjectsController', ProjectsController)
  .controller('ProjectDetailController', ProjectDetailController)
  .controller('TreeDetailController', TreeDetailController)
  .controller('AccountController', AccountController)
  .controller('LogoutController', LogoutController)

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

Injection annotation:
http://toddmotto.com/angular-js-dependency-injection-annotation-process/
*/