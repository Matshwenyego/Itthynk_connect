var mongoose = require('mongoose');
var bcrypt = require('bcrypt-node.js');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String},
    password: {type: String},
    picture: {type: String},
    cellphone: {type: String},
    qualification: {type: String},
    jobtitle: {type: String},
    bio: {type: String},
    verification:{
        isVerified: {type: Boolean, default: false},
        code:{type:String}
    }
});


userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')){
        return next;
    }
    bcrypt.genSalt(10, function(err, salt){
        if(err){return next(err);} 
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err){return next(err);}
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', userSchema);