'use strict';

describe("LoginController Unit Tests", function () {

    var $scope, ctrl, $timeout, $timeout, $http; //, $location;

    beforeEach(function () {
        module('qtraApp');

        inject(function ($rootScope, $controller, $q, _$timeout_) {
            $scope = $rootScope.$new();
            $timeout = _$timeout_;

            ctrl = $controller('LoginController', {
                $scope: $scope
            });
        });
    });

    it("should have a $scope variable", function() {
        expect($scope).toBeDefined();
    });

});

describe('qtraApp.controllers module', function() {

  beforeEach(module('qtraApp'));

  describe('LoginController', function(){

    it('should be defined', inject(function($controller, $rootScope) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LoginController', {$scope: $scope});
      expect(ctrl).toBeDefined();
    }));

  });

});
