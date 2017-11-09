var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('express-flash');
var User = require('../models/user');

passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local-login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, function(email, password, done) {
    User.findOne({email: email}, function(err, user){
        if(err) { return done(err); }

        if(!user) { return done(null, false); }

        if(!user.comparePassword(password)){
            return done(null, false);
        }
        return done(null, user);
    });
}));

passport.use('local-signup', new localStrategy({
    emailField: 'email',
    passwordField: 'password'
}, function(email, password, done){
    User.findOne({email: email}, function(err, user){
        if(err){return done(err);}
        if(user){
            done();
        }
            const new_user = new User({
            email: email,
            password: password
        });
            new_user.save(function(err){
                done(null, new_user);
            });
    })
}));

exports.isAuthenticated = function(req, res, done){
    if(req.isAuthenticated()) { return done(); }

    res.json({ message: 'Unauthenticated'});
}