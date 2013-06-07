//https://gist.github.com/fwielstra/1025038
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var teamSchema = new Schema({
    teamName: String,
    leaderName: String,
    votes: Number,
    judgeRank: {type: Number, default: 0},
    teamList: [String]
});
 
module.exports = mongoose.model('Team', teamSchema);

