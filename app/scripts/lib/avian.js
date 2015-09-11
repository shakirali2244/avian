var map;
var markers = [];
var drones = [];
var socket;
var statusBox = document.getElementById('statusBox');
var currentAlt = document.getElementById("currentAlt");
var currentAltInt = document.getElementById("currentAltInt");
var gotoPressed = false;
var infoWindowClosedPressed = false;
var infoWindowOpen = false;

var mapStyle = [
{
	"featureType": "administrative",
		"stylers": [
		{
			"visibility": "off"
		}
	]
},
{
	"featureType": "poi",
	"stylers": [
	{
		"visibility": "simplified"
	}
	]
},
{
	"featureType": "road",
	"elementType": "labels",
	"stylers": [
	{
		"visibility": "simplified"
	}
	]
},
{
	"featureType": "water",
	"stylers": [
	{
		"visibility": "simplified"
	}
	]
},
{
	"featureType": "transit",
	"stylers": [
	{
		"visibility": "simplified"
	}
	]
},
{
	"featureType": "landscape",
	"stylers": [
	{
		"visibility": "simplified"
	}
	]
},
{
	"featureType": "road.highway",
	"stylers": [
	{
		"visibility": "off"
	}
	]
},
{
	"featureType": "road.local",
	"stylers": [
	{
		"visibility": "on"
	}
	]
},
{
	"featureType": "road.highway",
	"elementType": "geometry",
	"stylers": [
	{
		"visibility": "on"
	}
	]
},
{
	"featureType": "water",
	"stylers": [
	{
		"color": "#84afa3"
	},
	{
		"lightness": 52
	}
	]
},
{
	"stylers": [
	{
		"saturation": -17
	},
	{
		"gamma": 0.36
	}
	]
},
{
	"featureType": "transit.line",
	"elementType": "geometry",
	"stylers": [
	{
		"color": "#3f518c"
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
		mapTypeId: google.maps.MapTypeId.HYBRID
	});

	map.set('styles', mapStyle);


	socket = io.connect('localhost');
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

	map.addListener('mouseover', function(event) {
		google.maps.event.trigger(map, 'resize');
	});

}

function addDrone(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		icon: '/images/drone8.png'
	})
	drones.push(marker);
	map.panTo(marker.getPosition());
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
    
    markers.push(marker);

    google.maps.event.addListener(infowindow, 'closeclick', function() {

        // Bind the click event on your button here
        
        console.log("infoWindow closed");
        infoWindowClosedPressed = true;
        infoWindowOpen = false;
        markers.pop().setMap(null);

    });

    infowindow.open(map,marker);
}

function shiftMarker() {
    console.log("Before" + markers);
    markers.shift().setMap(null);
    console.log("After" + markers);
}

function sendGoto(){
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
