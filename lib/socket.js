exports.start = function start(socket){
	console.log('a user connected');
	//to/from drones


  	socket.on('test',function (data){
    console.log(data);
    io.sockets.emit('location', [JSON.parse(data)])
  	})

    //socket.emit('request','assda')


    socket.on('goto',function (data){
      io.sockets.emit('commandFromServerToPi', { commandName: 'goto' , lat: data.lat , lon: data.lon });
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

    
    //End Client -> Pi Commands

    //Start Pi -> Client Commands

    socket.on('notificationFromPi', function(value) {
      io.sockets.emit('notificationFromServerToClient', value);
    });

    

  console.log("sent");
}