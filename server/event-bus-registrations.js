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