var User = require('../models/user.js');
var Team = require('../models/team.js');

function getTeamByVotedId(teams, votedId){
  var foundTeam = null;
  teams.forEach(function(team){
    if(votedId.equals(team.id)){
      foundTeam = team;
      return;
    }
  });
  return foundTeam;
}

exports.index = function(req, res){
  var totalVotes = 0;
  Team.find({}, function (err, teams) {
    teams.forEach(function(team){
      team.votes = 0;
      team.judgeWeight = 0;
      team.finalVotes = 0;
    });
    User.find({}, function (err, users) {
      users.forEach(function(user){
        if(user.votedTeamId){
          totalVotes++;
          //console.log(user.votedTeamId);
          var team = getTeamByVotedId(teams, user.votedTeamId);
          if(team){
            //console.log(team.teamName);
            team.votes++;
            /*
            if(team.votes){
              console.log('adding 1');
              team.votes++;
            }else{
              console.log('init to 0');
              team.votes = 1;
            }
            */
          }else{
            console.log('Team not found!');
          }
        }
      });

      console.log("teamName - votes - judgeWeight - judgeWeight");
      teams.forEach(function(team){
        team.judgeWeight = team.votes * totalVotes / 2 / 21;
        team.finalVotes = team.votes + team.judgeWeight;
        team.finalVotes = Math.round(team.finalVotes * 100) / 100
        console.log(team.teamName + ' - ' + team.votes + ' - ' + team.judgeWeight + ' - ' + team.finalVotes);
      });

      res.render('winner', {teams: teams});
    });
  });
};

