var express = require('express');
var morgan = require('morgan');

var bodyParser = require('body-parser');
var helmet = require('helmet');
var cors = require('cors');
var mongoose = require('mongoose');
require('./config/passport');
var passport = require('passport');
var secret = require('./config/secret');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect(secret.database, function(err){
    if(err){
        console.log("cannot connect to the database", err);
    }else{
        console.log("connected to the database");
    }
})

var app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.cookieSecret,
	store: new MongoStore({url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
}); 


var apiRoutes = require('./api/user');
app.use(userRoutes);


app.listen(secret.port, function(req, res){
    console.log('Application is running on port ' + secret.port);
});