var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

// MIDDLEWARES !! https://github.com/senchalabs/connect#middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get('/login', function(req, res) {
    res.send('login m8')
  });

app.get('/', function(req, res){
  res.send('hello world');
});

  
//Local strategy

passport.use(new LocalStrategy(
	function(username, password, done) {
	  User.findOne({ username: username }, function(err, user) {
	    if (err) { return done(err); }
	    if (!user) {
	      return done(null, false, { message: 'Incorrect username.' });
	    }
	    if (!user.validPassword(password)) {
	      return done(null, false, { message: 'Incorrect password.' });
	    }
	    return done(null, user);
	  });
	}
));


app.listen(3000);