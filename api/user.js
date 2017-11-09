var User = require('../models/user');
var router = require('express').Router();
var passport = require('passport');
var nodemailer = require('nodemailer');

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
       new_user.save((err,savedUser)=>{
        if(err){return next(err);}
       

        console.log("new user created");
        let id = savedUser._id.toString();
        savedUser.verification.code =id.substring(19).toUpperCase();

        User.findByIdAndUpdate(savedUser._id,savedUser, (err,response)=>{
            if (err) return next(err);

            let transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'thapelo.dev@gmail.com',
                    pass:'0114141440'
                }
            });
 
            const mailOptions = {
                 from:'Itthynk Connect <NO-REPLY@ITTHYNK.COM>',
                 to:savedUser.email,
                 subject:'Welcome to Itthynk Smart Solutions',
                 html:`<div>
                         <h2>Welcome `+savedUser.email +` </h2>
                             <p>Your Account has be created for use on the itthynk connect platform please install and enter the verification code below: </p>
                             <h4>`+savedUser.verification.code+`</h4>
                       </div>`
            }

            transporter.sendMail(mailOptions,(err,info)=>{
                console.log('error');
                 if (err){
                     console.log('error',err);
                     return next(err);
                 }else{
                     console.log('info',info)
                     res.json({"response":"User successfully Created"})
                 }
            })
        })
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

router.post('/api/user/verify',function(req,res,next){
    User.findOne({"verification.code":req.body.code}, function(err,user){
        if (err) return next(err);
        if (!user){
           return res.json({error:`account couldn't be verified`})
        }else{
            user.verification.isVerified= true;
            User.findByIdAndUpdate(user._id, user, function(err,savedUser){
                if (err) return next(err);
                return res.json(savedUser);
            })
        }
    })
});

module.exports = router;