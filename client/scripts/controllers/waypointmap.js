'use strict';

/**
 * @ngdoc function
 * @name AvianServer.controller:WayPointMapCtrl
 * @description
 * # WayPointMapCtrl
 * Controller of the Waypoint Map
 */
angular.module('AvianServer')
	.controller('WayPointMapCtrl', [ '$scope', function($scope) {
	    angular.extend($scope, {
	        sfu: {
	            lat: 49.2767296,
	            lng: --122.9182344,
	            zoom: 4
	        }
	    });
	}]);