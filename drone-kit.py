import time
import copy
import math
import os, os.path
import simplejson as json
from socketIO_client import SocketIO, LoggingNamespace

import droneapi.lib
from droneapi.lib import VehicleMode, Location
from pymavlink import mavutil

#socketIO.emit('eventname',msg), where msg is JSON

# Working flight logic
# WGS84 coordinate system for latitude and longitude
# PEP 0008 Naming Conventions

# !TODO Threading to increase socket block and run bg tasks
# !TODO Seperate as library
# !TODO Seperate classes
# !TODO Streamline local logging for messages and errors
# !TODO Better exception handling

# !TODO Goto limit (fence) to distance 10m
# !TODO Support get_parameter and set_parameter in validation
# !TODO Clean up circle

# !TODO Track group (track with notification)
# !TODO Check point/altitude reached group (distance to point while tracking, logging/notifying)
# !TODO Check inflight/stable flight group (flight stability validation)
# !TODO Log/notification grouping

class Drone(object):
    FUNCTION_CALL = 0
    MANDATORY_ARGUMENTS = 1
    OPTIONAL_ARGUMENTS = 2
    DEFAULT_ALTITUDE = 30

    connectionEstablished = False

    def __init__(self, targetIP, port=3000, refresh_rate=1, threadID=0):
        self.connectionEstablished = False
        self.missionInProgress = False
        self.inFlight = False
        self.stableFlight = False
        self.notification = False
        self.armed = False

        self.api = local_connect()
        self.gps_lock = False
        
        self.vehicle = self.api.get_vehicles()[0]
        self.vehicle.parameters['ARMING_CHECK']=0
        self.commands = self.vehicle.commands
        self.current_coords = []

        self.vehicle.add_attribute_observer('armed', self.armed_callback)
        self.vehicle.add_attribute_observer('location', self.location_callback)
        #self.vehicle.add_attribute_observer('mode', self.mode_callback)
        self.vehicle.add_attribute_observer('gps_0', self.gps_callback)

        #commandparser init
        self.SocketIO_Specs = SocketIO_Specs
        self.eventName = ' '
        self.response = ' '

        #SocketDrone init

        self.refresh_rate = refresh_rate
        self.threadID = threadID
        self.targetIP = targetIP
        self.port = port
        self.socketIO = SocketIO(self.targetIP, self.port, LoggingNamespace)


    def takeoff(self, alt = DEFAULT_ALTITUDE):
        """
        Arms self.vehicle and fly to aTargetAltitude.
        """
        
        print "Basic pre-arm checks"
        # Don't let the user try to fly autopilot is booting
        if self.vehicle.mode.name == "INITIALISING":
            print "Waiting for self.vehicle to initialise"
            time.sleep(1)
        while self.vehicle.gps_0.fix_type < 2:
            print "Waiting for GPS...:", self.vehicle.gps_0.fix_type
            time.sleep(1)

                    
        print "Arming motors"
        # Copter should arm in GUIDED mode
        self.vehicle.mode    = VehicleMode("GUIDED")
        self.vehicle.armed   = True
        self.vehicle.flush()
        
        self.socketIO.emit('notificationFromPi', 'Arming...')
        
        while not self.vehicle.armed and not self.api.exit:
            print " Waiting for arming..."
            time.sleep(1)
        
        print "Taking off!"
        self.vehicle.commands.takeoff(alt) # Take off to target altitude
        self.vehicle.flush()
        
        self.inFlight = True
        
        # Wait until the self.vehicle reaches a safe height before processing the goto (otherwise the command 
        #  after self.vehicle.commands.takeoff will execute immediately).
        while not self.api.exit:
            print " Altitude: ", self.vehicle.location.alt
            notification = "Altitude: " + str(self.vehicle.location.alt) + ' m'
            self.socketIO.emit('notificationFromPi', notification)
            self.socketIO.emit('trackFromPi',json.dumps({'lat': self.vehicle.location.lat,'lng': self.vehicle.location.lon, 'alt': self.vehicle.location.alt, 'yaw': self.vehicle.attitude.yaw }))
            if self.vehicle.location.alt>=alt*0.95: #Just below target, in case of undershoot.
                notification =  "Reached target altitude of " + str(alt) + ' m'
                self.socketIO.emit('notificationFromPi', notification)
                self.stableFlight = True
                break;
            time.sleep(1)

    def land(self, mode = 0):
        if mode == 0:
            self.vehicle.mode = VehicleMode("RTL")
        elif mode == 1:
            self.vehicle.mode = VehicleMode("Land")
        self.inFlight = False

    def stop(self, mode = False):
        pass #TODO, prereq: Threading

    def gps_callback(self, gps):
        self._log("GPS: {0}".format(self.vehicle.gps_0))
        if self.gps_lock is False:
            self.gps_lock = True
            self.vehicle.remove_attribute_observer('gps_0', self.gps_callback)

    def armed_callback(self, armed):
        self.armed = True
        self.vehicle.remove_attribute_observer('armed', self.armed_callback)

    def location_callback(self, location):
        self.vehicle.remove_attribute_observer('location', self.location_callback)

        location = self.vehicle.location
        
        if location.alt is not None:
            self.altitude = location.alt

        self.current_location = location
    
    def altitude(self, mode, alt):
        #validate mode, alt
        try:
            alt = float(alt)
        except Exception, e:
            print "Altitude not a number"
            return False

        location = self.vehicle.location

        if(mode == 'up'):
            location.alt = location.alt + alt 
            self.vehicle.commands.goto(location)
        elif(mode == 'down'):
            location.alt = location.alt - alt
            self.vehicle.commands.goto(location)
        else:
            print "Invalid argument"
            return False

        alt = location.alt

        while not self.api.exit:
            print " Altitude: ", self.vehicle.location.alt
            notification = "Altitude: " + str(self.vehicle.location.alt) + ' m'
            self.socketIO.emit('notificationFromPi', notification)
            self.socketIO.emit('trackFromPi',json.dumps({'lat': self.vehicle.location.lat,'lng': self.vehicle.location.lon, 'alt': self.vehicle.location.alt, 'yaw': self.vehicle.attitude.yaw}))
            if self.vehicle.location.alt>=alt*0.95: #Just below target, in case of undershoot.
                notification =  "Reached target altitude of " + str(alt) + ' m'
                self.socketIO.emit('notificationFromPi', notification)
                self.stableFlight = True
                break;
            time.sleep(1)


    def guided(self, lat, lon, alt=DEFAULT_ALTITUDE):
        print "Current:"
        print self.vehicle.location.lat, self.vehicle.location.lon, self.vehicle.location.alt
        try:
            alt = float(alt); lat = float(lat); lon = float(lon)
        except Exception, e:
            print "Invalid argument type: expected number"
        print "Target:"
        print lat, lon, alt, type(lat), type(lat), type(alt)
        if not self.inFlight or not self.armed:
            notification =  "Not armed yet"
            self.socketIO.emit('notificationFromPi', notification)
            print "Not armed yet"
            return False
        point = Location(lat, lon, alt, is_relative=True)
        self.stableFlight = False
        self.vehicle.commands.goto(point)
        self.vehicle.flush()
        Dist = self.findDistance(self.vehicle.location,lat,lon)
        #Rtime = findTime(Dist)
        print 'Distance(m) : ', Dist
        #print " Approximate Time(s) :",Rtime
        while (Dist > 0.8):
            Dist = self.findDistance(self.vehicle.location,lat,lon)
            #Rtime = findTime(Dist)
            print 'Distance to Destination(m) : ', Dist
            notification =  "Distance to Destination:" + str(Dist) + ' m'
            self.socketIO.emit('notificationFromPi', notification)
            #print " approximate time to destination(s) : ", Rtime
            if Dist <= 0.3:
                print 'Reached target location'
                break;
            self.socketIO.emit('trackFromPi',json.dumps({'lat': self.vehicle.location.lat,'lng': self.vehicle.location.lon, 'alt': self.vehicle.location.alt, 'yaw': self.vehicle.attitude.yaw }))
            time.sleep(1)
        self.stableFlight = True
        self.socketIO.emit('completedExecutionFromPi', json.dumps({'commandName': 'goto'}))

    def findDistance(self, location, gps_x, gps_y):
        cgps_x = math.radians(location.lat)
        cgps_y = math.radians(location.lon)
        tgps_x = math.radians(gps_x)
        tgps_y = math.radians(gps_y)
        dgps_x = cgps_x - tgps_x
        dgps_y = cgps_y - tgps_y
        R = 6371000 # Earth's radius
        # find the distance
        a = math.sin(dgps_x/2) * math.sin(dgps_x/2) + math.cos(cgps_x/2)* math.cos(tgps_x/2) * math.sin(dgps_x/2) * math.sin(dgps_y/2) 
        b = 2 * math.asin(math.sqrt(math.fabs(a)))
        Distance = R * b
        return Distance

    def get_parameter(self, parameterName):
        try:
            return self.vehicle[parameterName]
        except Exception, e:
            print "Invalid parameter"
    def set_parameter(self, parameterName, parameterValue):
        try:
            self.vehicle[parameterName] = parameterValue
        except Exception, e:
            print "Invalid parameter"

    def _log(self, message):
        print "[DEBUG]: {0}".format(message)

    def circle(self, radius, alt, turns = 0, lat = None, lon = None):
        #turns 0 = unlimted mode
        #R = radius of the circle
        # pts = numbeer of circles
        #aTargetAltitude

        pts = 36

        if not self.inFlight or not self.armed:
            notification =  "Not armed yet"
            self.socketIO.emit('notificationFromPi', notification)
            print "Not armed yet"
            return False

        stableFlight = False

        if not lat and not lon:
            gps_x = self.vehicle.location.lat
            gps_y = self.vehicle.location.lon
        elif (lat and not lon) or (lon and not lat):
            return "Invalid arguments"
        else:
            gps_x = lat; gps_y = lon

        if turns == 0:
            print "Not implemented"
            return False
        else:
            cirNum = turns 
            circleFly =True
        
        #CurrLoc =numpy.array([gps_x,gps_y])    
        iang = 360/pts #increment  value
        ang = 0 #declare ang
        count = 0# store how many circles have the drone fly
        while circleFly == True: 
            #Find the next way points of the circle
            Wpt = self.findCoordinatefromDis(gps_x,gps_y,float(radius),ang)
            print Wpt
            self.guided(Wpt[0], Wpt[1],alt)# fly to the way points
            ang += iang #increment the angle's value
                # check if it roates a round; if so; increment the count
            if ang == iang *(pts + 1):
                ang = 0
                count += 1
                # break the while when it rearches the limit
                if count == turns:
                    circleFly = False

        guided(gps_x,gps_y,alt)#After it ends, fly back to the original place

        stableFlight = True

    def findCoordinatefromDis(self, gps_x,gps_y,dis,ang):# find the map coordinates with given location, angle and distance
        #modified from the example
        d = float(dis)
        R= 6378137.0 #Radius of "spherical" earth
        
        lat1 = math.radians(gps_x)
        lon1 = math.radians(gps_y)
        #formula to find the coordinates
        lat2 = math.asin(math.sin(lat1) * math.cos(d/R) + math.cos(d/R) * math.sin(d/R) * math.cos(math.radians(ang)))
        lon2 = lon1 + math.atan2(math.sin(math.radians(ang)) * math.sin(d/R) * math.cos(d/R), math.cos(d/R) - math.sin(lat1) * math.sin(lat2))

        return [math.degrees(lat2),math.degrees(lon2)]

    def _print_argument(self, argument):
        print "Socket On " + self.eventName
        print 'Arguments'
        print '---Raw---'
        print argument
        print '---Type---'
        print type(argument)
        print '---EventName---'
        print self.eventName 
        print '---IndividualValues---'
        for key, value in argument.iteritems():
            print key, value
            print type(value)

    def validator(self, argument):
        #Need to streamline generic validation 

        print "Validating Arguments"

        argumentsOnly = copy.copy(argument)

        try:
            if argumentsOnly.has_key('commandName'):
                argumentsOnly.pop('commandName') 
                commandType = 'commandName' 
            else:
                argumentsOnly.pop('parameterName')
                commandType = 'parameterName'

        except Exception, e:
            print "exception, wrong Format"
            return [False, False, False]

        print argument

        basicFormat = mandatoryArguments = optionalArguments =  True

        try:
            for arguments in self.SocketIO_Specs[self.eventName][argument['commandName']][self.MANDATORY_ARGUMENTS]:
                if not argumentsOnly.has_key(arguments):
                    mandatoryArguments = False
                    print arguments + 'not in argument'

            for arguments in self.SocketIO_Specs[self.eventName][argument['commandName']][self.OPTIONAL_ARGUMENTS]:
                if not argumentsOnly.has_key(arguments):
                    optionalArguments = False
        except Exception, e:
            print 'exception, socket key error'
            return [False, False, False]

        print basicFormat, mandatoryArguments, optionalArguments
        return [basicFormat, mandatoryArguments, optionalArguments, commandType]


    def parse(self, argument):
        print "Parsing Arguments"
        print "Validating Arguments"
        self._print_argument(argument)
        # if not (self.validator(SocketIO_Specs[self.eventName])):
        [basicFormat, mandatoryArguments, optionalArguments, commandType] = self.validator(argument)
        print "Done Validation"

        if not mandatoryArguments or not basicFormat:
            return False

        args = {}
        for key, value in argument.iteritems():
            if not key in commandType:
                args[key] = value

        print "Done Parsing"

        return [args, commandType]

    def listen(self):
        while True:  
            for eventName, response in SocketIO_Specs.iteritems():
                self.eventName = eventName
                self.socketIO.on(eventName, self.listener) 
            
            self.socketIO.emit('trackFromPi',json.dumps({'lat': self.vehicle.location.lat,'lng': self.vehicle.location.lon, 'alt': self.vehicle.location.alt, 'yaw': self.vehicle.attitude.yaw }))

            self.socketIO.wait(seconds = self.refresh_rate)
            print "\n-----\n"
    def listener(self, *argument):
        argument = argument[0]
        args = self.parse(argument)
        if not args:    
            print "Invalid Argument"
        else:
            self.callCommand(argument, args[0], args[1])

    def callCommand(self, argument, args, commandType):
        # argument[1](drone, optionalArguments) if optionalArguments else argument[1](drone)
        print "Executing Drone Command"
        print args
        self.SocketIO_Specs[self.eventName][argument[commandType]][self.FUNCTION_CALL](self, **args)
        # argument[1](self.drone, *args)

#Each command corresponds to the corresponding function, mandatory parameters followed by optional parameters

SocketIO_Specs = {
    'commandFromServerToPi' : {
        'land' : [
            getattr(Drone, 'land'),
            ['mode'], 
            []
        ],
        'takeoff' : [ 
            getattr(Drone, 'takeoff'),
            [],
            ['alt']
        ],   
        'goto': [
            getattr(Drone, 'guided'),
            ['lat', 'lon'], 
            ['alt']
        ],
        'altitude': [
            getattr(Drone, 'altitude'),
            ['mode', 'alt'], 
            []
        ],
        'automatic': [
            getattr(Drone, 'circle'),   
            ['radius'], 
            ['lat','lon','turns']
        ],
        'circle': [
            getattr(Drone, 'circle'),
            ['radius'], 
            ['lat','lon','turns', 'alt']
        ],
        'stop': [
            getattr(Drone, 'stop'),
            ['return'],
            []
        ]
    },
    'GetParameterFromServerToPi': [
        getattr(Drone, 'get_parameter'),
        ['parameterName'],
        []
    ],
    'SetParameterFromServerToPi': [
        getattr(Drone, 'set_parameter'),
        ['parameterName'],
        []
    ]
}

Drone('127.0.0.1', 8080).listen()
