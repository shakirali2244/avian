'use strict';

/**
 * @ngdoc function
 * @name avianApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the avianApp
 */
angular.module('avianApp')
  .controller('MainCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var map;
  	$scope.$on('mapInitialized', function(evt, evtMap) {
    map = evtMap;
    $scope.placeMarker = function(e) {
      var marker = new google.maps.Marker({position: e.latLng, map: map});
      map.panTo(e.latLng);
    }

    var socket = io.connect('http://localhost:3000');
  });
});