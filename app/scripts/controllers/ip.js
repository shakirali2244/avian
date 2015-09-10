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

  	$scope.ip = 'Waiting for IP From Pi...'

  	var socket;
  	socket = io.connect('http://localhost:3000');

  	socket.on('ipFromServer', function(data){
  		$scope.ip = data;
  		socket.emit('ipAckFromClient', 'ack');
  	});
});