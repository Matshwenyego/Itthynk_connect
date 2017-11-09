var User = require('../models/user');
var router = require('express').Router();
var passport = require('passport');


router.post('/api/user/login', function(req, res, next){
    passport.authenticate('local-login', function(err, user, info){
        if(err){return next(err);}
        if(!user){
            res.status(404).json({response: "user cannot be found"});
        }
        res.status(200).json(user);
    })(req, res, next);
});

router.post('/api/user/signup', function(req, res, next){
   User.findOne({email: req.body.email}, (err, user)=>{
       if(err){return next(err);}
       if(user){res.status(401).json({response: "User already exist with that email"})}
       var new_user = new User({
           email: req.body.email,
           password: req.body.password
       });
       new_user.save((err)=>{
           if(err){return next(err);}
           res.json({response: "User created", user: new_user});
       });
   });
});

router.get('/api/users', function(req, res, next){
    User.find(function(err, users){
        if(err){return next(err);}
        res.json(users);
    });
});

router.get('/api/user/:id', function(req, res, next){
    User.findById(req.params.id, function(err, user){
        if(err){return next(err)}
        res.json(user);
    });
});


module.exports = router;