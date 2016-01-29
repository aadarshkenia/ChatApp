var socket = io();
var marker_self = 0; // Marker for messages written by self

$(document).ready(function(){
	//Set focus on message input area
	$('#message-box').focus();

	var updateChatBox = function(msg, marker){
		if(marker === marker_self)
			$('#messages').append($('<li class="bubble bubble-self">').text(msg));
		else
			$('#messages').append($('<li class="bubble bubble-others">').text(msg));
		updateScroll();
	}

	var updateScroll = function(){
		var messageBoxElem = document.getElementById('messages');
		$("#messages").animate({ scrollTop: messageBoxElem.scrollHeight}, 1000);
	}

	var sendMessageToServer = function(message){
		socket.emit('chat-message', message);
		$('#message-box').val('');
		//Update chat Box with current message
		updateChatBox(message, 0);
	}	

	//Send message on button click
	$('#send-message-btn').click(function(){
		var message = $('#message-box').val();
		sendMessageToServer(message);
	});

	//Send message on pressing enter
	$('#message-box').keypress(function(e){
		var message = $('#message-box').val();
		if(e.which == 13 || e.keyCode == 13){
			sendMessageToServer(message);
		}
	});

	//Recieve message from server
	socket.on('chat-message', function(msg){
		updateChatBox(msg);		
	});

});
