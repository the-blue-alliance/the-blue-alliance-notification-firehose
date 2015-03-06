var firebase = new Firebase('https://thebluealliance.firebaseio.com/notifications/');

firebase.on('value', function(snapshot) {
    updateNotifications(snapshot);
});

function updateNotifications(snapshot){
    snapshot.forEach(function(child){
        var data = child.val();
        var payload = data['payload'];
        if(payload == null){
            return;
        }
        var timeString = data['time'];
        var time = new Date(timeString+"+00:00").toLocaleString();
        var messageData = JSON.stringify(payload['message_data'], null, 2);
        var messageType = payload['message_type'];

        var card = $('<div>', {'class': 'panel'});
        card.addClass(messageType);
        var body = $('<div>', {'class': 'panel-body'});
        var eventKey = 'XXXX????';
        switch(messageType) {
            case 'alliance_selection':
                card.addClass('panel-material-red');
                eventKey = payload['message_data']['event_key'];

                body.append($('<strong>', {text: 'Alliance Selection Results: TODO'}));
                break;
            case 'awards_posted':
                card.addClass('panel-material-green');
                eventKey = payload['message_data']['event_key'];

                body.append($('<strong>', {text: 'Awards Posted'}));
                break;
            case 'match_score':
                card.addClass('panel-material-indigo');
                eventKey = payload['message_data']['match']['event_key'];

                body.append($('<strong>', {text: 'Match Score'}));
                var redTeams = payload['message_data']['match']['alliances']['red']['teams'];
                var blueTeams = payload['message_data']['match']['alliances']['blue']['teams'];
                var redScore = payload['message_data']['match']['alliances']['red']['score'];
                var blueScore = payload['message_data']['match']['alliances']['blue']['score'];
                body.append($('<div>', {text: redTeams.toString() + ' - ' + redScore}));
                body.append($('<div>', {text: blueTeams.toString() + ' - ' + blueScore}));
                break;
            case 'schedule_updated':
                card.addClass('panel-material-light-blue');
                eventKey = payload['message_data']['event_key'];

                body.append($('<strong>').append($('<a>', {'href': 'http://www.thebluealliance.com/event/'+eventKey, 'target': '_blank', text: 'Schedule Updated'})));
                break;
            case 'starting_comp_level':
                card.addClass('panel-material-purple');
                eventKey = payload['message_data']['event_key'];

                levels = {
                    'qm': 'Qualification',
                    'qf': 'Quarterfinal',
                    'sf': 'Semifinal',
                    'f': 'Final',
                }

                body.append($('<strong>', {text: levels[payload['message_data']['comp_level']] + ' matches starting'}));
                break;
            case 'upcoming_match':
                card.addClass('panel-material-orange');
                eventKey = payload['message_data']['match_key'].split('_')[0];

                body.append($('<strong>', {text: 'Upcoming Match'}));

                var redTeams = payload['message_data']['team_keys'].slice(0, 3);
                var blueTeams = payload['message_data']['team_keys'].slice(3, 6);
                body.append($('<div>', {text: redTeams.toString()}));
                body.append($('<div>', {text: blueTeams.toString()}));
                break;
            default:
                body.append($('<strong>', {text: messageType}));
                body.append($('<pre>', {text: messageData}));
                break;
        }
        var heading = $('<div>', {
            'class': 'panel-heading',
            text: payload['message_data']['event_name']+" ["+eventKey.toUpperCase().substring(4)+"]"
        }).append($('<span>', {'class': 'pull-right', text: time}));
        $('#notifications').prepend(card.append(heading).append(body));
    });
}
