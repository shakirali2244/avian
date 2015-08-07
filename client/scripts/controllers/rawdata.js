'use strict';

/**
 * @ngdoc function
 * @name AvianServer.controller:BirdCtrl
 * @description
 * # BirdCtrl
 * Controller of the AvianServer for the BlackBird view
 */
angular.module('AvianServer')
  .controller('RawDataCtrl', function ($scope, KeyDown, KeyUp, Socket) {        
    
    $scope.offboardControlStatusText = 'OFF';
    $scope.offboardControlButtonType = 'btn-danger';
    $scope.aux1Value = 0;
    
    //Establish Connection
    Socket.emit('command', 'msg');
    
    var map;
    $scope.$on('mapInitialized', function(evt, evtMap) {
      map = evtMap;
      $scope.placeMarker = function(e) {
        var marker = new google.maps.Marker({position: e.latLng, map: map});
        map.panTo(e.latLng);
          var lat = e.latLng.lat();
          var lng = e.latLng.lng();
          var command = '1,0,'+lat+','+lng+',,';
        Socket.emit('commandFromClient', command);
      }
    });
    
    $scope.offboardControl = function() {
        if($scope.offboardControlStatusText === 'ON'){
            //Disable offboard control
            $scope.offboardControlStatusText = 'OFF';
        }
        else {
            //Enable Offboard Control
            $scope.offboardControlStatusText = 'ON';
        }
        $scope.offboardControlButtonType = (($scope.offboardControlStatusText==='OFF') ? 'btn-danger' : 'btn-warning');
    };
    
    // Refer to firmware docs for command structure
    
    $scope.takeoff = function() {
        Socket.emit('commandFromClient', '0,0,,,,');
        console.log('sent takeoff command');
    };
    
    $scope.land = function() {
        Socket.emit('commandFromClient', '0,1,,,,');
        console.log('sent land command');
    };
    

    /* Code below almost completely unnecessary now
     * Only need Aux 1 for flight mode control in case of emergency
    */
    
    $scope.aux1Up = function() {
      console.log('AUX1 increased');
      Socket.emit('controlAux1FromClient', 'up');   
    };

    $scope.aux1Down = function() {
      console.log('AUX1 decreased');
      Socket.emit('controlAux1FromClient', 'down');
    };
    

    KeyDown.bind('g', function() {
      $scope.aux1Down();
    });
    KeyDown.bind('t', function() {
      $scope.aux1Up();
    });

    
    Socket.on('notificationFromServerToClient', function(value) {
        $scope.notificationText = value;
    });
    
    Socket.on('Aux1FromServerToClient', function(value) {
        $scope.aux1Value = value;
    });
});