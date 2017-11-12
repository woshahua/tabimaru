var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Purpose = new Schema({
    userid : {type: String, require: true, unique: true},
    purpose : { type: String, require: true}
});

module.exports = mongoose.model('purpose', Purpose);