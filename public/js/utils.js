'use strict';

var $localstorage = function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}
$localstorage.$inject = ['$window'];


var $changeState = function($state, $ionicHistory) {
  return {
    go: function(location) {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go(location);
      $ionicHistory.clearHistory();
    }
  }
}
$localstorage.$inject = ['$state', '$ionicHistory'];


angular
  .module('qtraApp.utils', [])
  .factory('$localstorage', $localstorage)
  .factory('$changeState', $changeState)