var express = require('express');
var app = express();
var con = require(__dirname + '/db/localconfig.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
  done(null, user[0].id);
});

// used to deserialize the user
passport.deserializeUser(function(idloc, done) {
    con.knex('users').select().where({id: parseInt(idloc)}).then(function(a,err) {
 	done(err, a[0]);
    })
.catch(function(error) {
    console.error(error)
    });
});

// MIDDLEWARES !! https://github.com/senchalabs/connect#middleware
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true });
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);

app.get('/login', function(req, res) {
    if (!(req.user == undefined)){
		res.redirect('/admin');
	}else{
		res.render('login.ejs',{});
	}
  });

app.post("/login",passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/login',
                                   failureFlash: true }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/'); //Can fire before session is destroyed?
});

app.get('/', function(req, res){
  res.send('hello world');
});

  
//Local strategy

passport.use(new LocalStrategy(
	{
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, username, password, done,err) { 
    // check in mongo if a user with username exists or not
    con.knex('users').select().from('users').where({username: username}).then(function(a) {
        //In case of any error, return using the done method
        //console.log(a);
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (a.length == 0){
          console.log('User Not Found with username '+username);
          return done(null, false);                 
        }
        // User exists but wrong password, log the error\
        console.log(password+a[0].hash)
        if (password.localeCompare(a[0].hash)){
          console.log('Invalid Password');
          return done(null, false);
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, a);
      }
    );
}));


app.listen(3000);