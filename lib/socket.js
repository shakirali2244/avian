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
  console.log("sent");
}