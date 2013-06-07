
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , admin = require('./routes/admin')
  , voting = require('./routes/voting')
  , winner = require('./routes/winner')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/votinghatdb');

var app = express();

// all environments
app.set('port', process.env.VCAP_APP_PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/*
app.use(function (req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", -1);
    console.log('res.header=');
    console.log(res.header);
  if (req.url === '/') {
  }
  next();
});
*/

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('votinghatsecret'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function requireLogin(){
  return function(req, res, next) {
    if(req.session.user){
      next();
    }else{
      res.redirect('/');
    }
  }
};

function requireAdmin(){
  return function(req, res, next) {
    if(req.session.isAdmin){
      next();
    }else{
      res.redirect('/');
    }
  }
};

app.get('/', routes.index);
//app.get('/allUsers', routes.allUsers);
app.get('/test', routes.test);
app.get('/createAdmins', routes.createAdmins);
app.get('/logout', routes.logout);
app.post('/verifyToken', routes.verifyToken);
//app.get('/loginAs', routes.loginAs);
app.get('/admin', requireAdmin(), admin.index);
app.post('/admin/setupDb', requireAdmin(), admin.setupDb);
app.post('/admin/allUsers', requireAdmin(), admin.allUsers);
app.post('/admin/allTeams', requireAdmin(), admin.allTeams);
app.post('/admin/saveUser', requireAdmin(), admin.saveUser);
app.post('/admin/saveJudgeVote', requireAdmin(), admin.saveJudgeVote);
app.post('/admin/deleteUser', requireAdmin(), admin.deleteUser);
app.get('/voting', requireLogin(), voting.index);
app.post('/voting/addVote', requireLogin(), voting.addVote);
app.post('/voting/allTeams', requireLogin(), voting.allTeams);
app.get('/winner', requireAdmin(), winner.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
