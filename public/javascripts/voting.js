var selectedTeamId = 0, $submitVoteBtn;

$(function(){
  init();
  getTeams();
});

function init() {
  $submitVoteBtn = $('#submitVoteBtn');
  $submitVoteBtn.on('click', function(){
    var url = '/voting/addVote';
    var postData = {teamId: selectedTeamId};
    $.ajax({
      type: "POST",
      url: url, data: postData}).done(function(data){
      showVoteSubmitSuccess('Vote submitted successfully.');      
      console.log(data);
    }).fail(function(err){
      //console.log(err);
      showVoteSubmitError('Error submitting vote. Contact administrator.');      
    });
  });
}


function showVoteSubmitSuccess(msg){
  $('#voteSubmitSuccess').hide();
  $('#voteSubmitError').hide();
  $('#voteSubmitSuccessMsg').text(msg);
  $('#voteSubmitSuccess').show();
}

function showVoteSubmitError(msg){
  $('#voteSubmitSuccess').hide();
  $('#voteSubmitError').hide();
  $('#voteSubmitErrorMsg').text(msg);
  $('#voteSubmitError').show();
}

function getTeams() {
  $.ajax({
    type: "POST",
    url: '/voting/allTeams'
  }).done(function(data){
      var votedTeamId = $('#votedTeamId').val();
      var ddData = [];
      $.each(data, function (i, team) {
          var selectedTeam = false;
          if(votedTeamId == team._id){
            selectedTeam = true;
          }
          ddData.push({
              text: team.teamName,
              value: team._id,
              selected: selectedTeam,
              description: team.leaderName
          });
      });
      //console.log(ddData);

      $('#winnerTeamContainer').ddslick({
          data: ddData,
          background: 'rgb(205, 247, 255)',
          width: 300,
          selectText: "Select the winner team!",
          imagePosition: "right",
          onSelected: function (selectedTeam) {
              console.log(selectedTeam);
              if (selectedTeamId == 0) {
                  //$('#submitVoteBtn').prop("disabled", false);
                  $submitVoteBtn.removeClass('disabled');
              }
              selectedTeamId = selectedTeam.selectedData.value;
          }
      });
  }).fail(function(err){
    console.log('Failed to get teams.');
    console.log(err);
  });

}
