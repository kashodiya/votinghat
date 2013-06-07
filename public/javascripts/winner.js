$(function(){

  sortVotes();

  function sortVotes(){
    console.log('soring...');

    var liContents = [];
    $('#winnerList li').each (function () {
        liContents.push($(this));
    });

    console.log(liContents);

    liContents.sort(function(a,b) {
      //console.log(a.data('final-votes'));
      //console.log(b.data('final-votes'));
      var aVotes = Number(a.data('final-votes'));
      var bVotes = Number(b.data('final-votes'));

      if (aVotes > bVotes)
        return -1;
      if (aVotes < bVotes)
        return 1;
      return 0;
    });

    console.log(liContents);

    $.each (liContents, function (i, liContent) {
      $('#winnerListSorted').append($('<li>').html(liContent.html()));
    });

  }

});