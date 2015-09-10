exports.start = function start(socket){
	console.log('a user connected');

	//to/from drones
	socket.on('trackFromPi',function (data){
		console.log('Got trackFrompi as ' + data);
		io.sockets.emit('location', [JSON.parse(data)]);
	});

	socket.on('notificationFromPi', function (data){
		console.log('Got notificationFromPi ' + data);
		io.sockets.emit('notification', data);
	});

	socket.on('ipFromPi', function (data){
		console.log('Got ipFromPi ' + data);
		io.sockets.emit('ipFromServer', data);
	});

	//socket.emit('request','assda')


	socket.on('goto',function (data){
		console.log('sending goto with data '+ data.lat + ", " + data.lon + ", " + data.alt);
		io.sockets.emit('commandFromServerToPi', { commandName: 'goto' , lat: data.lat , lon: data.lon, alt: data.alt });
	});

	socket.on('land',function (data){
		console.log('sending land with mode '+data);
		io.sockets.emit('commandFromServerToPi', { commandName: 'land' , mode: data});
	});

	socket.on('takeoff',function (data){
		console.log('sending takeoff with altitude '+ data)
		io.sockets.emit('commandFromServerToPi', { commandName: 'takeoff' , alt: data});
	});

	socket.on('altitude',function (data){
		console.log('sending altitude ' + data.mode + ' by ' + data.alt)
		io.sockets.emit('commandFromServerToPi', { commandName: 'altitude' , mode: data.mode , alt: data.alt});
	});


	//to/from clients
	/*socket.emit("location",[{lat: 49.277447,lng: -122.917120},
	  {lat:49.278447, lng:-122.917120},
	  {lat:49.279447, lng:-122.917120},
	  {lat:49.28047, lng:-122.917120},
	  {lat:49.281547, lng:-122.917120}]);
	  */
	//Start Client -> Pi Commands

	socket.on('controlThrottleFromClient', function(command) {
		io.sockets.emit('controlThrottleFromServerToPi', command);
	});

	socket.on('notificationFromPi', function(value) {
		io.sockets.emit('notificationFromServerToClient', value);
	});

	socket.on('getIPFromServer', function (data){
		console.log('Got ipFromServer ' + data);
		io.sockets.emit('getIPFromClient', data);
	});

	socket.on('getIPFromClient', function (data){
		console.log('Got ipFromClient ' + data);
		io.sockets.emit('getIPFromServer', data);
	});


	console.log("sent");
}
