var map;
var markers = [];
var drones = [];
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.277447, lng: -122.917120},
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });


  var socket = io.connect('http://localhost:3000');
  socket.on('location', function(data){
    if (!map){
     map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.277447, lng: -122.917120},
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.HYBRID
      });
     }
    deleteDrones();
    
    for (var i = 0; i < data.length; i++) {
      addDrone(data[i]);
    }
    console.log(drones)
  });

  map.addListener('click', function(event) {
    addMarker(event.latLng);
  });

}

function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);

    var contentString = '<button type="button"  onClick="deleteMarkers()" class="btn btn-default" aria-label="Left Align">
        <span class="glyphicon glyphicon-trash" aria-hidden="true"> Clear Markers</span>
      </button>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

    socket.emit('goto',{ lat : location.lat, lon: location.lng } );
  }

function addDrone(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    drones.push(marker);
  }

function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);
  }

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

function setMapOnAllDrone(map) {
    for (var i = 0; i < drones.length; i++) {
      drones[i].setMap(map);
    }
  }


  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  function clearDrones() {
    setMapOnAllDrone(null);
  }

  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  function deleteDrones() {
    clearDrones();
    drones = [];
  }
