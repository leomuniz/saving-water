var Mongoose = require('mongoose');
var bcrypt = require("bcrypt")
const saltRounds = 10;

var Schema = Mongoose.Schema;

var UserSchema = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] }
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);