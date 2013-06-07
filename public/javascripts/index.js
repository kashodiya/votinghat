
$(function(){
  init();
  registerLoginForm();
  checkTokenInUrl();
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function checkTokenInUrl(){
  //console.log(getParameterByName('token'));
  var token = getParameterByName('token');
  if(token != ''){
    $("#loginForm input[name=token]").val(token);
  }
}


function loginFormError(msg){
  $('#loginFormError').hide();
  $('#loginFormErrorMsg').text(msg);
  $('#loginFormError').show();
}

function registerLoginForm(){
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    if($("#loginForm input[name=token]").val() == ''){
      loginFormError('Please enter valid token. If you do not have token contact Kaushik Ashodiya.');        
      $("#loginForm input[name=token]").focus();
      return;
    }
    var data = $(this).serialize();
    console.log('verifyToken clicked');
    console.log(data);
    $.ajax({
      type: "POST",
      url: "/verifyToken",
      data: data,
    }).done(function(data) {
      console.log(data);
      if(data.error){
        //console.log('ERROR');
        loginFormError('Login error. Verify your token. Token is case-sensitive.');        
      }else{
        if(data.isAdmin){
          //console.log('IS ADM');
          document.location.href='/admin';
        }else{
          console.log('Name = ' + data.user.name);
          document.location.href='/voting';
        }
      }
    }).fail(function(data) {
        loginFormError('Login error. Contact administrator.');        
    });
  });
}

function init() {
  $("#loginForm input[name=token]").focus();
  $("#tokenTooltip").popover({
    container: "body",
    html: true,
    trigger: "hover focus click",
    title: "Token is required",
    content: "If you do not have token contact <strong>Kaushik Ashodiya</strong> to get one."});
}

