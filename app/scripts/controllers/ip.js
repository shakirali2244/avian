'use strict';

/**
 * @ngdoc function
 * @name avianApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the avianApp
 */
angular.module('avianApp')
  .controller('ipCtrl', function ($scope) {

  	$scope.ipinfo = 'Waiting for IP Info From Pi...'

  	var socket;
  	socket = io.connect('http://test.avianrobotics.com');

  	$scope.getIP = function(){
  		console.log("Sent request to get IP info")
  		socket.emit('getIPFromClient', 'get');
  	};

  	socket.on('ipFromServer', function(data){
		console.log(data);
  		$scope.ipinfo = "Recieved IP Info...";
  		$scope.ipinfo = String(data);
  	});
});