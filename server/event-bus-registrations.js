Bus = new EventBus();

Bus.register('server-version-changed', function(server, newVersion) {
    var message = 'Version change from ' + server.version + ' to ' + newVersion;
    EventLog.insert({
        type: 'server-version-changed',
        serverId: server._id,
        timeStamp: new Date(),
        event: 'Version Change',
        message: message
    });
});


Bus.register('server-status-changed', function(server, message) {
    var status = server.upStatus ? "Up" : "Down";
    EventLog.insert({
        type: 'server-status-changed',
        serverId: server._id,
        timeStamp: new Date(),
        event: 'Status changed to ' + status,
        message: message || ""
    });
});

//send emails on server version change to users who have the server on favourites
Bus.register('server-version-changed', function(server, newVersion) {
    var subject = server.serverGroup + ': ' + server.name + ' - Version change from ' + server.version + ' to ' + newVersion;

    Favourites.find({serverId: server._id}).forEach(function(favourite) {
        var user = Meteor.users.findOne({_id: favourite.userId});

        if(user && user.emails.length) {
            Email.send({
                to: user.emails[0].address,
                from: Configuration.mailFrom,
                subject: subject,
                text: ""
            });
        }
    });
});
//send emails on server status change to users who have the server on favourites
Bus.register('server-status-changed', function(server, message) {
    var subject = server.serverGroup + ': ' + server.name + ' is now ' + (server.upStatus ? "Up" : "Down");

    Favourites.find({serverId: server._id}).forEach(function(favourite) {
        var user = Meteor.users.findOne({_id: favourite.userId});

        if(user && user.emails.length) {
            Email.send({
                to: user.emails[0].address,
                from: Configuration.mailFrom,
                subject: subject,
                text: message
            });
        }
    });
});





Bus.register('page-view', function(data) {
    data.type = 'page-view';
    console.log(data);
    EventLog.insert(data);
});

Bus.register('page-action', function(data) {
    data.type = 'page-action';
    console.log(data);
    EventLog.insert(data);
});