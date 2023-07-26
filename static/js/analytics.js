var roomName = (window.roomName || ''),
	baseUrl = (window.baseUrl || ''),
	clientId = (window.clientId || ''),
	eventId = (window.eventId || '');


if( roomName ){
	document.addEventListener('DOMContentLoaded', callAnalytics('enter_' + roomName));
			
	var formLeave = document.getElementById('formLeave');
			
	formLeave.addEventListener('submit', function(evt){
		evt.preventDefault();
		callAnalytics('leave_' + roomName);
		setTimeout( function(){ window.close(); }, 1000 );			
	});
}


function callAnalytics(action){
	if( action && baseUrl ){
		var xhttp = new XMLHttpRequest(),
			endpoint = baseUrl + 'analytics' + '/';
		endpoint += action + '/';
		if( clientId ){
			endpoint += clientId + '/';
			if( eventId ){
				endpoint += eventId;	
			}
		}
		xhttp.open('GET', endpoint, true);
		xhttp.send();
	}
	return null;
}