$(function(){
  var totalTeams = 0;
  var allTeams = [], allUsers = [];
  var $userForm = $("#userForm");
  var $userFormAsNew = $("#userForm input[name=asNew]");
  var $userFormId = $("#userForm input[name=id]");
  var $userFormName = $("#userForm input[name=name]");
  var $userFormToken = $("#userForm input[name=token]");
  var $userFormVotedForId = $("#userForm input[name=votedForId]");

  getUsersAndTeams();

  $('#saveUserBtn').on("click", function (event) {
    saveUser(false);
  });

  $('#saveUserAsNewBtn').on("click", function (event) {
    saveUser(true);
  });

  $('#deleteUserBtn').on("click", function (event) {
    var data = $userForm.serialize();
    $.ajax({
      type: "POST",
      url: "/admin/deleteUser",
      data: data,
    }).done(function(data) {
      console.log(data);
      if(data.error){
        console.log('ERROR');
      }else{
        //Notify that it is saved
      }
    }).fail(function(err) {
      console.log(err);
    });
  });

  function getTeamByVotedId(votedTeamId){
    var foundTeam = null;
    $.each(allTeams, function(i, team){
      if(votedTeamId == team._id){
        foundTeam = team;
        return;
      }
    });
    return foundTeam;
  }

  function showVotes(){
    console.log('getting votes...');
//    console.log(allTeams);
//    console.log(allUsers);
    var totalVotes = 0;
    $.each(allTeams, function(i, team){
      team.votes = 0;
      team.judgeWeight = 0;
      team.finalVotes = 0;
      team.voters = [];
    });
    $.each(allUsers, function(i, user){
      if(user.votedTeamId){
        totalVotes++;
//        console.log(user);
        var team = getTeamByVotedId(user.votedTeamId);
        if(team){
          team.votes++;
          team.voters.push(user);
        }
      }
    });

    $.each(allTeams, function(i, team){
      //console.log(parseFloat(team.votes) * parseFloat(totalVotes) / 2.0 / 21.0);
      //team.judgeWeight = parseFloat(team.votes) * parseFloat(totalVotes) / 2.0 / 21.0;
      if(team.votes == 0){
        team.votes = 1;
      }
      team.judgeWeight = team.votes * totalVotes / 2.0 / 21.0;
      team.judgeWeight = Math.round(team.judgeWeight * 100) / 100
      team.finalVotes = team.votes + team.judgeWeight;
      //team.finalVotes = Math.round(team.finalVotes * 100) / 100
      //console.log(team.teamName + ' - ' + team.votes + ' - ' + team.judgeWeight + ' - ' + team.finalVotes);
    });
    
    var votesTemplate = Handlebars.compile ($('#votesTemplate').html());
    $('#votesTableBody').empty().append(votesTemplate({teams: allTeams}));

    $('#showVotesMsg').html('Total votes: ' + totalVotes + ' | Total voters: ' + allUsers.length);

    showUserTeamVotes();

  }

  function showUserTeamVotes(){
    $.each(allTeams, function(i, team){
      team.voterList = [];
      $.each(allUsers, function(i, user){
        if(user.votedTeamId){
          if(team._id == user.votedTeamId){
            team.voterList.push(user.name);
          }
        }
      });
    });
    var userTeamVotesTemplate = Handlebars.compile ($('#userTeamVotesTemplate').html());
    $('#userTeamVotes').empty().append(userTeamVotesTemplate({teams: allTeams}));
  }

  $('#showVotes').on('click', function(){
    //showVotes();
    getUsersAndTeams();
  });
  

  function saveUser(asNew){
    $userFormAsNew.val(asNew);
    var data = $userForm.serialize();
    console.log('Serialized post of /admin/saveUser = ');
    console.log(data);
    $.ajax({
      type: "POST",
      url: "/admin/saveUser",
      data: data,
    }).done(function(data) {
      console.log(data);
      if(data.error){
        console.log('ERROR');
      }else{
        //Notify that it is saved
      }
    }).fail(function(err) {
      console.log(err);
    });
  }

  $userForm.on("submit", function (event) {
    event.preventDefault();
  });

  $('#userList').on("click", ".userLink", function(event) {
    //event.stopPropagation()
    var $userLink = $(this);
    console.log(this);
    console.log($userLink);
    console.log($userLink.data('name'));
    $userFormName.val($userLink.data('name'));
    $userFormToken.val($userLink.data('token'));
    $userFormVotedForId.val($userLink.data('voted-team-id'));
    $userFormId.val($userLink.data('user-id'));
  });

  $("#setupDb").on("click", function (event) {
    event.preventDefault();
    console.log('setting up db...');


    $.ajax({
      type: "POST",
      url: "/admin/setupDb"
    }).done(function(data) {
      console.log(data);
      if(data.error){
        $('#setupError').html('Error setting up database. ' + data.error);
      }else{
        $('#setupError').html('Success! Database is setup. <a href="/admin">Reload page</a> | <a href="/logout">Logout</a>');
      }
    }).fail(function(err) {
      $('#setupError').html('Error setting up database. Failed to call setup on the server.');
      console.log(err);
    });

  });

  function getUsersAndTeams(){
    allTeams = [];
    allUsers = [];
    $.ajax({
      type: "POST",
      url: "/admin/allUsers"
    }).done(function(data){
      var userRowTemplate = Handlebars.compile ($('#userRowTemplate').html());
      $('#userList').empty().append(userRowTemplate({users: data}));
      allUsers = data;
      //console.log(data);
      if(allUsers.length > 0 && allTeams.length > 0){
        showVotes();
      }
    }).fail(function(err){
      console.log('Failed to get all users');
      console.log(err);
    });


    $.ajax({
      type: "POST",
      url: "/admin/allTeams"
    }).done(function(data){
      allTeams = data;
      var teamRowTemplate = Handlebars.compile ($('#teamRowTemplate').html());
      var judgeVotesTemplate = Handlebars.compile ($('#judgeVotesTemplate').html());
      totalTeams = data.length;
      $.each(data, function(i, team){
        if(team.judgeRank > 0){
          team.judgeRankR = totalTeams - team.judgeRank + 1;
        }
      });
      $('#teamList').empty().append(teamRowTemplate({teams: data}));
      $('#judgeVotesSection').empty().append(judgeVotesTemplate({teams: data}));
      if(allUsers.length > 0 && allTeams.length > 0){
        showVotes();
      }
      //console.log(data);
    }).fail(function(err){
      console.log('Failed to get all teams');
      console.log(err);
    });

  }


  function showRankError(msg){
    $('#judgeVotesFormSuccess').hide();
    $('#judgeVotesFormError').hide();
    $('#udgeVotesFormErrorMsg').text(msg);
    $('#judgeVotesFormError').show();
  }

  function showRankSuccess(msg){
    $('#judgeVotesFormError').hide();
    $('#judgeVotesFormSuccess').hide();
    $('#judgeVotesFormSuccessMsg').text(msg);
    $('#judgeVotesFormSuccess').show();
  }

  $("#judgeVotesForm").on("submit", function (event) {
    event.preventDefault();
    var formIsValid = true; 
    var ranks = [];
    $("#judgeVotesForm .rankInput").each(function(i, rankInput){
      var $rankInput = $(rankInput);
      var rank = Number($rankInput.val());
      if(rank > totalTeams){
        console.log('can not be grater than ' + totalTeams);
        formIsValid = false;
        showRankError('Votes myst be in the range of 1 and ' + totalTeams + '.');
        return false;
      }
      ranks.push(rank);
    });

    if(!formIsValid){
      return false;
    }else{
      var allRanksEntered = true;
      for(var i = totalTeams; i > 0; i--){
        var rankFound = false;
        ranks.forEach(function(rank){
          if(rank == i){
            rankFound = true;
            return false;
          }
        });
        if(!rankFound){
          console.log('rank not found ' + i);
          allRanksEntered = false;
          break;
        }
      }
      if(!allRanksEntered){
        showRankError('Votes myst be in the range of 1 and ' + totalTeams + '. And all then ranks must be filled. No duplicates allowed.');
        console.log('Not all ranks found.')
        return false;
      }
    }

  
    var data = $(this).serialize();
    console.log('submitting judge rank');
    console.log(data);
    $.ajax({
      type: "POST",
      url: "/admin/saveJudgeVote",
      data: data,
    }).done(function(data) {
      console.log(data);
      if(data.error){
        console.log('ERROR');
      }else{
        console.log('done!');
        showRankSuccess('Ranks saved successfully.');
      }
    }).fail(function(err) {
      console.log(err);
    });
  });

});