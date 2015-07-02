Bus = new EventBus();

Bus.register('server-version-changed', function(server, newVersion) {
    var message = 'Version change from ' + server.version + ' to ' + newVersion;
    EventLog.insert({serverId: server._id,
        timeStamp: new Date(),
        event: 'Version Change',
        message: message
    });
});


Bus.register('server-status-changed', function(server, message) {
    var status = server.upStatus ? "Up" : "Down";
    EventLog.insert({serverId: server._id,
        timeStamp: new Date(),
        event: 'Status changed to ' + status,
        message: message || ""
    });
});