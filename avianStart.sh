nohup /home/ubuntu/.dronekit/sitl/copter-3.3/apm --home=49.276765,-122.917957,100,0 --model=quad & #start SITL	
mavproxy.py --master=tcp:127.0.0.1:5760 #start firmware
nohup node . & #start the server
