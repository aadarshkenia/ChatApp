var socket = io();

$(document).ready(function(){
	//Send message on button click
	$('#send-message-btn').click(function(){
		var message = $('#message-box').val();
		socket.emit('chat-message', message);
		$('#message-box').val('');
	});

	//Recieve message from server
	socket.on('chat-message', function(msg){
		$('#messages').append($('<li class="bubble">').text(msg));
	});
});
