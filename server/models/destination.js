var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Destination = new Schema({
    userid : {type: String, require: true, unique: true},
    destination : { type: String, require: true}
});

module.exports = mongoose.model('destination', Destination);