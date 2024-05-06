const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

const UsersSchema = mongoose.Schema({
    username: {
        type: Schema.Types.String,
        unique : true,
        required : true
    },
    password:{
        type: Schema.Types.String,
        required: true ,
    }
},{ timestamps: true });

UsersSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, async function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UsersSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UsersSchema.methods.changePassword = function(newPassword, cb) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return cb(err);
        bcrypt.hash(newPassword, salt, function(err, hash) {
            if (err) return cb(err);
            cb(null, hash);
        });
    });
};

const Users = module.exports = mongoose.model('user', UsersSchema);