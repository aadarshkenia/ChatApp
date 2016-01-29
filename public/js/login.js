var socket = io();
$(document).ready(function(){
	$('#username').focus();

	$('#loginSubmitBtn').click(function(e){
		var username = $('#username').val();
		var password = $('#password').val();
		socket.emit('username', username);
		socket.emit('password', password);
	});
});