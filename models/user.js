var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
    name: String,
    token: String,
    votedTeamId: ObjectId
});
 
module.exports = mongoose.model('User', userSchema);