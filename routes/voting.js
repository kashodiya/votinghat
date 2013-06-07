var mongoose = require('mongoose');
var User = require('../models/user.js');
var Team = require('../models/team.js');

exports.index = function(req, res){
  var userId = req.session.user._id;
  User.findOne({_id: userId}, function (err, user) {
    res.render('voting', {user: user, isAdmin: req.session.isAdmin });
  });
};

exports.allTeams = function(req, res){
  Team.find({}, function (err, docs) {
    res.json(docs);
  });
};

exports.addVote = function(req, res){
  var teamIdStr = req.body.teamId;
  var userId = req.session.user._id;
  User.findOne({_id: userId}, function (err, user) {
    if(user){
      user.votedTeamId = mongoose.Types.ObjectId(teamIdStr);
      user.save(function(err){
        console.log('Save err?');
        console.log(err);
        if(err){
          res.json({error: err});
        }else{
          res.json({done: 'OK'});
        }
      });
    }else{
      res.json({error: 'Session user not found!'});
    }
  });
};


