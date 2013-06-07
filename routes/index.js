var User = require('../models/user.js');
var Team = require('../models/team.js');

exports.setup = function(req, res){
  User.find({token: token}, function (err, docs) {
    if(docs.length == 0){
      var user = new User({name: 'Kaushik Ashodiya', token: '123admin123'});
      user.save(function(error){
        console.log(error);
        console.log('User is saved.');
      });

    }
    res.json(docs);
  });
  res.render('admin');
};

exports.createAdmins = function(req, res){
  console.log('setting up db');
  var admin1 = new User({name: 'Kaushik Ashodiya', token: '123admin123'});
  var admin2 = new User({name: 'Marie Dimapasoc', token: '123super123'});
  //user.save(function(error){
  User.create([admin1, admin2], function(error){
    if(error){
      console.log(error);
      res.json({error: error});
    }else{
      console.log('2 admins created.');
      res.json({done: "OK"});
    }
  });
};

exports.index = function(req, res){
  res.render('index');
};

exports.allUsers = function(req, res){
  User.find({}, function (err, docs) {
    res.json(docs);
  });
};


exports.test = function(req, res){
  res.json(req.session);
}

exports.logout = function(req, res){
  delete req.session.user;
  req.session.isAdmin = false;
  res.redirect('/');
};

exports.verifyToken = function(req, res){
  delete req.session.user;
  req.session.isAdmin = false;
  var token = req.body.token;
  console.log('searching token = ' + token);
  User.findOne({token: token}, function (err, user) {
    if(user){
      var isAdmin = false;
      if(token == '123admin123' || token == '123super123'){
        req.session.isAdmin = true;
        isAdmin = true;
      }
      req.session.user = user;
      res.json({isAdmin: isAdmin, user: user});
    }else{
      res.json({error: 'Invalid token'});
    }
  });
};


