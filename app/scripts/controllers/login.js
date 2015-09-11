'use strict';

/**
 * @ngdoc function
 * @name avianApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the avianApp
 */
angular.module('avianApp')
  .controller('LoginCtrl', function ($scope, $http, $window) {

    $scope.username = "";
    $scope.password = "";

    $scope.authenticate = function() {
      console.log("hello");
    	var data = {
            	username: $scope.username,
              password: $scope.password
        }
      console.log(data);

    $http.post('http://localhost/login/',
              data).success(function(data, status) {
            console.log(status);
            if (status == 200){
              $window.location.href = 'http://test.avianrobotics.com/#/panel';
            }

        });
  }
});