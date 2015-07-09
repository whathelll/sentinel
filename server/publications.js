Meteor.publish('servergroups', function(){
    return ServerGroups.find();
});

Meteor.publish('servers', function(){
    return Servers.find();
});

Meteor.publish('eventLogForServer', function(serverId) {
    return EventLog.find({serverId: serverId}, {sort: {timeStamp: -1}, limit: 50});
});

Meteor.publish('favourites', function(userId) {
    console.log('******************************************************meteor user:', userId);
    return Favourites.find({userId: userId});
});