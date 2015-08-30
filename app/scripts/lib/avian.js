  var map;
var markers = [];
var drones = [];
var socket;
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.277447, lng: -122.917120},
    zoom: 14
  });


  socket = io.connect('http://localhost:3000');
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
    setMapOnAll(null);
    addMarker(event.latLng);
  });

}

function addDrone(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: '/images/drone8.png'
    })
    drones.push(marker);
  }

function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: '/images/goto8.png'
    });
        var contentString = 'Select Altitude <select class="form-control" id="altitude">'+
    '<option value="0">0</option>'+
    '<option value="10">10</option>'+
    '<option value="30">30</option>'+
    '</select>'+
    '<br />'+
    '<button type="button"  onClick="sendGoto()" class="btn btn-primary" aria-label="Left Align">'+
    '<span class="glyphicon glyphicon-send" aria-hidden="true"> Goto</span>'+
      '</button>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  infowindow.open(map,marker);
    markers[0] = marker;
  }

function sendGoto(){
  var marker = markers[0];
  var lat = marker.getPosition().lat()
  var lon = marker.getPosition().lng()
  var sel =  document.getElementById("altitude");
  var alt = sel.options[sel.selectedIndex].value;
  console.log('sending go to ' + lat + ', ' + lon + ', '+ alt);
  socket.emit('goto',{ lat : lat, lon: lon, alt: alt} );
}

function sendLand(){
  console.log('sending land with mode 1 i.e. emergency landing');
  socket.emit('land',1);
}

function sendHome(){
  console.log('sending land with mode 0 i.e. go home');
  socket.emit('land',0);
}

function sendTakeoff(){
  console.log('sending takeoff with alt 20');
  socket.emit('takeoff',20);
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