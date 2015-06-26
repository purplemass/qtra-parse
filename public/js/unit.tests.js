'use strict';

describe("LoginController Unit Tests", function () {

    var ctrl, $scope, $timeout;

    beforeEach(function () {
        module('qtraApp');

        inject(function ($rootScope, $controller) {
            $scope = $rootScope.$new();

            ctrl = $controller('LoginController', {
                $scope: $scope
            });
        });
    });

    it("should have a $scope variable", function() {
        expect($scope).toBeDefined();
    });

});

describe('qtraApp.controllers', function() {

  beforeEach(module('qtraApp'));

  describe('LoginController', function(){

    it('should be defined', inject(function($rootScope, $controller) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LoginController', {$scope: $scope});
      expect(ctrl).toBeDefined();
    }));

  });

});

describe('LoginController', function() {
    var scope;

    beforeEach(angular.mock.module('qtraApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller){
        scope = $rootScope.$new();
        $controller('LoginController', {$scope: scope});
    }));

    it('should have variable data', function(){
        expect(scope.data).toBeDefined();
    });

});

// http://www.tuesdaydeveloper.com/2013/06/angularjs-testing-with-karma-and-jasmine/
