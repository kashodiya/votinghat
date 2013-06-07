var mongoose = require('mongoose');
var User = require('../models/user.js');
var Team = require('../models/team.js');

exports.index = function(req, res){
  res.render('admin');
};


exports.deleteUser = function(req, res){
  console.log(req.body);
  User.findOne({token: req.body.token}, function (err, user) {
    if(user){
      user.remove();
      res.json({done: 'OK'});
    }else{
      res.json({error: 'User with token [' + req.body.token + '] not found.'});
    }
  });
};

exports.saveUser = function(req, res){
  console.log(req.body);
  if(req.body.asNew == 'true'){
    console.log('New user');
    var user = new User({name: req.body.name, token: req.body.token});
    user.save(function(err){
      console.log(err);
      if(err){
        res.json({error: err});
      }else{
        res.json({done: 'OK'});
      }
    });
  }else{
    console.log('Updating user');
    User.findOne({token: req.body.token}, function (err, user) {
      if(user){
        user.name = req.body.name;
        if(req.body.votedForId != ''){
          console.log('Saving votedForId = ' + req.body.votedForId);
          user.votedForId = mongoose.Types.ObjectId(req.body.votedForId);
        }
        user.save(function(error){
          if(error){
            res.json({error: error});
          }else{
            res.json({done: 'OK'});
          }
        });
      }else{
        res.json({error: 'User with token [' + req.body.token + '] not found.'});
      }
    });
  }
  res.json({done: 'OK'});
};

exports.allUsers = function(req, res){
  User.find({}, function (err, docs) {
    res.json(docs);
  });
};

exports.allTeams = function(req, res){
  Team.find({}, function (err, teams) {
    res.json(teams);
  });
};


exports.saveJudgeVote = function(req, res){
  console.log('saving judge rank');
  //console.log(req.body);
  var teamIds = [];
  Team.find({}, function (err, teams) {
    var teamCount = teams.length;
    teams.forEach(function(team){
      var id = team.id;
      //console.log(id);
      //console.log('req.body[id]:');
      //console.log(req.body[id]);
      var rank = teamCount + 1 - Number(req.body[id]);
      team.judgeRank = rank;
      teamIds.push(team.id);
      //console.log(team.id);
      //console.log(team.teamName);
      //console.log(team.judgeRank);
      team.save();
    });
  });

  res.json({done: 'OK'});
};

exports.setupDb = function(req, res){
  console.log('setting up db');
  User.remove({}, function(err) { 
    console.log('User collection removed');
    var admin1 = new User({name: 'Kaushik Ashodiya', token: '123admin123'});
    var admin2 = new User({name: 'Marie Dimapasoc', token: '123super123'});
    //user.save(function(error){
    User.create([admin1, admin2], function(error){
      if(error){
        console.log(error);
      }else{
        console.log('2 admins created.');
      }
    });
  });

  Team.remove({}, function(err) { 
    console.log('User collection removed');
    if(err){

    }else{

      var allUsers = [{"name":"Arthur Jay","token":"w778s"},{"name":"Kathleen Young","token":"ck17h"},{"name":"Sharon Chow","token":"w7eeh"},{"name":"Ash Rawal","token":"2aosx"},{"name":"Michael Derry","token":"vnx19"},{"name":"Susan Karasoff","token":"pku1u"},{"name":"Satyesh Jaiswal","token":"laq8r"},{"name":"Ken Simurdiak","token":"gl8u2"},{"name":"Venkat Gorthi","token":"0qza8"},{"name":"Raja Eswar","token":"bdb4x"},{"name":"Kevin Luke","token":"80ns3"},{"name":"Sridhar Vanukuri","token":"8izyh"},{"name":"Eric, Zhao","token":"vfyj0"},{"name":"Rao, Srini","token":"b023z"},{"name":"Taranvir Gill","token":"uf4dt"},{"name":"Yili Liang","token":"60tii"},{"name":"Alex Alongi","token":"lwj8m"},{"name":"Yili Liang","token":"pmf6i"},{"name":"Siva Sreeraman","token":"sev93"},{"name":"Vinod Balagopalan","token":"quzsd"},{"name":"Harman Singh","token":"aty2i"},{"name":"Subroto Datta","token":"j1g4x"},{"name":"Ron Zurawski","token":"n4n6c"},{"name":"Joseph Perez","token":"eum0k"},{"name":"Johnson Lee","token":"15ft2"},{"name":"Mahinder Chawla","token":"lbwfk"},{"name":"Christophe Fromy","token":"4t9hz"},{"name":"Richard Hsu","token":"hcbyj"},{"name":"Joseph Miguel","token":"awdrj"},{"name":"Ron Javier","token":"m2cs7"},{"name":"Michael Finocchio","token":"pvcvz"},{"name":"Jasveen Bajwa","token":"rktyd"},{"name":"Stan Yuen","token":"tf8nu"},{"name":"Uma Lakkaraju","token":"cvheu"},{"name":"Pablo Vega","token":"83yso"},{"name":"Aileen Gaurano","token":"6z6tq"}];
      //,{"name":"","token":""}
      var allTeams = [{"teamName":"Track&Crack","leaderName":"Satyesh Jaiswal","teamList":["Ken Simurdiak","Venkat Gorthi","Raja Eswar","Kevin Luke"]},{"teamName":"Pathfinders","leaderName":"Sridhar Vanukuri","teamList":["Eric, Zhao","Rao, Srini","Taranvir Gill"]},{"teamName":"SAY YES ","leaderName":"Yili Liang","teamList":["Alex Alongi","Yili Liang","Siva Sreeraman"]},{"teamName":"S532","leaderName":"Vinod Balagopalan","teamList":["Harman Singh","Subroto Datta","Ron Zurawski","Joseph Perez"]},{"teamName":"Alpha ","leaderName":"Johnson Lee","teamList":["Mahinder Chawla","Christophe Fromy","Richard Hsu","Joseph Miguel","Ron Javier"]},{"teamName":"Eagles","leaderName":"Michael Finocchio","teamList":["Jasveen Bajwa","Stan Yuen","Uma Lakkaraju","Pablo Vega","Aileen Gaurano"]}];

      User.create(allUsers, function(err){
        if(err){
          console.log(err);
        }else{
          console.log('Users created');
          Team.create(allTeams, function(err){
            if(err){
              console.log(err);
            }else{
              console.log('Teams created');
              res.json({done: 'OK'});
            }
          });
        }
      });
    }
  });

};
