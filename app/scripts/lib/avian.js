var map;
var markers = [];
var drones = [];
var infoWindowOpen = false;
var socket;
var statusBox = document.getElementById('statusBox');
var currentAlt = document.getElementById("currentAlt");
var currentAltInt = document.getElementById("currentAltInt");
var gotoPressed = false;
var infoWindowClosedPressed = false;
var infoWindowOpen = false;

var mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

statusBox.style.background = 'green';
statusBox.innerHTML = 'unarmed';
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.277447, lng: -122.917120},
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.HYBRID,
		disableDefaultUI: true,
                styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
	});

	//map.set('styles', mapStyle);


	socket = io.connect('http://badgerworks.org:8080');
	socket.on('location', function(data){
		if (!map){
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 49.277447, lng: -122.917120},
				zoom: 14,
				mapTypeId: google.maps.MapTypeId.HYBRID,
				disableDefaultUI: true
			});
		}
		deleteDrones();
		google.maps.event.trigger(map, 'resize');

		for (var i = 0; i < data.length; i++) {
			addDrone(data[i]);
			//console.log(x.value);
			currentAltInt.innerHTML = Math.round(data[i].alt);
			currentAlt.value = data[i].alt;
		}
		//console.log(drones)
	});

	socket.on('notification',function(data){
		var display_this=data;
		console.log("NOTIFICATION : "+data);
		if (data == "Arming..."){
			statusBox.innerHTML = "armed";
			statusBox.style.color= 'red';
		}

	});

    socket.on('completedExecutionFromServerToClient', function(data){
        console.log("Shifting marker")
        shiftMarker();
    });

	map.addListener('click', function(event) {
		//setMapOnAllMarkers(null)
        addMarker(event.latLng);

	});

	map.addListener('mouseout', function(event) {
		window.setTimeout(function() {
			if(typeof drones[0] != 'undefined') {
				map.panTo(drones[0].getPosition());
			}
			google.maps.event.trigger(map, 'resize');
		}, 1100);
	});
	map.addListener('mouseover', function(event) {
		google.maps.event.trigger(map, 'resize');
		window.setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
		}, 200);
		window.setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
		}, 400);
		window.setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
		}, 600);
		window.setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
		}, 800);
		window.setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
		}, 1100);
	});

}

function addDrone(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		icon: '/images/drone8.png'
	})
	drones.push(marker);
	if(infoWindowOpen === false) {
		map.panTo(marker.getPosition());
	}
}

function addMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		icon: '/images/goto8.png'
	});
	var contentString = '<div id = "infowindow">'+ 
        'Select Altitude <select class="form-control" id="altitude">'+
		'<option value="0">Maintain</option>'+
		'<option value="10">10</option>'+
        '<option value="20">20</option>'+
		'<option value="30">30</option>'+
        '<option value="40">40</option>'+
		'</select>'+
		'<br />'+
		'<button type="button" id = "gotoButton" onClick="sendGoto()" class="btn btn-primary" aria-label="Left Align">'+
		'<span class="glyphicon glyphicon-send" aria-hidden="true"> Goto</span>'+
		'</button>'+
        '</div>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});
    
    markers.push(marker);

    google.maps.event.addListener(infowindow, 'closeclick', function() {

        // Bind the click event on your button here
        
        console.log("infoWindow closed");
        infoWindowClosedPressed = true;
        infoWindowOpen = false;
        markers.pop().setMap(null);
    });

     google.maps.event.addListener(infowindow, 'domready', function() {
        $('#infowindow button').on('click',function(){
            // console.log(clickedLocation);
            infowindow.close();
        });
    });

	infoWindowOpen = true;
	infowindow.open(map,marker);
}

function shiftMarker() {
    console.log("Before" + markers);
    markers.shift().setMap(null);
    console.log("After" + markers);
}

function sendGoto(){
	infoWindowOpen = false;
	var gotoPressed = true;
    var marker = markers[markers.length-1];
	var lat = marker.getPosition().lat()
	var lon = marker.getPosition().lng()
	var sel =  document.getElementById("altitude");
	var alt = sel.options[sel.selectedIndex].value;
	if (alt == 0){
		console.log('sending go to with same altitude ' +  lat + ', ' + lon );
		socket.emit('goto',{ lat : lat, lon: lon } );
	}else{
		console.log('sending go to ' + lat + ', ' + lon + ', '+ alt);
		socket.emit('goto',{ lat : lat, lon: lon, alt: alt} );
	}
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
	console.log('sending takeoff with default alt');
	socket.emit('takeoff', 'default');
}

function sendIncreaseAlt(){
	console.log('sending increase altitude by 1m');
	socket.emit('altitude', {mode: 'up', alt: 1});
}

function sendDecreaseAlt(){
	console.log('sending decrease altitude by 1m');
	socket.emit('altitude', {mode: 'down', alt: 1});
}


function setMapOnAllMarkers(map) {
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
	setMapOnAllMarkers(null);
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
