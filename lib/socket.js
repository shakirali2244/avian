exports.start = function start(socket){
	console.log('a user connected');
	//to/from drones
  	socket.on('a',function (data){
    console.log(data);
  	})
  	//to/from clients
  socket.emit("location",[{lat: 49.277447,lng: -122.917120},
                          {lat:49.278447, lng:-122.917120},
                          {lat:49.279447, lng:-122.917120},
                          {lat:49.28047, lng:-122.917120},
                          {lat:49.281547, lng:-122.917120}]);

  //Start Client -> Pi Commands

    socket.on('controlThrottleFromClient', function(command) {
      io.sockets.emit('controlThrottleFromServerToPi', command);
    });

    socket.on('controlPitchFromClient', function(command) {
      io.sockets.emit('controlPitchFromServerToPi', command);
    });

    socket.on('controlRollFromClient', function(command) {
      io.sockets.emit('controlRollFromServerToPi', command);
    });

    socket.on('controlYawFromClient', function(command) {
      io.sockets.emit('controlYawFromServerToPi', command);
    });


    //Video stream
    socket.on('controlAux1FromClient', function(command) {
      io.sockets.emit('controlAux1FromServerToPi', command);
    });

    socket.on('controlAux2FromClient', function(command) {
      io.sockets.emit('controlAux2FromServerToPi', command);
    });

    socket.on('controlAux3FromClient', function(command) {
      io.sockets.emit('controlAux3FromServerToPi', command);
    });

    socket.on('setFlightModeFromClient', function(command) {
      io.sockets.emit('setFlightModeFromServerToPi', command);
    });

    socket.on('controlAltModeFromClient', function(command){
      io.sockets.emit('controlAltModeFromServerToPi', command);
    });

    socket.on('saveTrimFromClient', function(command){
      io.sockets.emit('saveTrimFromServerToPi', command);
    });

    socket.on('armFromClient', function(command){
      io.sockets.emit('armFromServerToPi', command);
    });

    //End Client -> Pi Commands

    //Start Pi -> Client Commands

    socket.on('notificationFromPi', function(value) {
      io.sockets.emit('notificationFromServerToClient', value);
    });

    socket.on('throttleFromPi', function(value) {
      io.sockets.emit('throttleFromServerToClient', value);
    });

    socket.on('pitchFromPi', function(value) {
      io.sockets.emit('pitchFromServerToClient', value);
    });

    socket.on('rollFromPi', function(value) {
      io.sockets.emit('rollFromServerToClient', value);
    });

    socket.on('yawFromPi', function(value) {
      io.sockets.emit('yawFromServerToClient', value);
    });

    //Video stream
    socket.on('Aux1FromPi', function(value) {
      io.sockets.emit('Aux1FromServerToClient', value);
    });

    socket.on('Aux2FromPi', function(value) {
      io.sockets.emit('Aux2FromServerToClient', value);
    });

    socket.on('Aux3FromPi', function(value) {
      io.sockets.emit('Aux3FromServerToClient', value);
    });

  console.log("sent");
}