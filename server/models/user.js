var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    userid : {type: String, require: true, unique: true},
    destination : { type: String}, 
    purpose : { type: String},
});

module.exports = mongoose.model('user', User);