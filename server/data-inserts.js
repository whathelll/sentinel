Meteor.methods({
    addServerGroup: function (groupName) {
        console.log("Adding new server group: " + groupName);
        ServerGroups.insert({
            name: groupName
        });
    }
});

Meteor.methods({
    addServer: function (name) {
        console.log("Adding new server: " + name);
        Servers.insert({
            name: 'new',
            serverGroup: name,
            pollInterval: 10,  //no. of seconds
            upStatus: false,
            upStatusUrl: 'http://localhost',
            upStatusMethod: "GET",  //GET or POST
            upStatusPostHeader: undefined,
            upStatusPostData: undefined,
            upStatusPostResultRegex: undefined,
            version: "",
            versionUrl: 'http://localhost',
            lastUpdateTime: undefined,
            lastError: ""
        });
    }
});

Meteor.methods({
    editServerGroup: function (oldName, groupName) {
        console.log("Editing server group: " + oldName);
        Servers.update(
            {serverGroup: oldName},
            {$set: {serverGroup: groupName}},
            {multi: true}
        );

        ServerGroups.update(
            {name: oldName},
            {$set: {name: groupName}}
        );
    }
});

Meteor.methods({
    editServer: function (id, name, url, versionUrl, interval, method, postHeader, postData, postRegex) {
        console.log("Editing server: " + id);
        Servers.update(
            {_id: id},
            {$set: {name: name,
                upStatusUrl: url,
                versionUrl: versionUrl,
                pollInterval: interval,
                upStatusMethod: method,
                upStatusPostHeader: postHeader,
                upStatusPostData: postData,
                upStatusPostResultRegex: postRegex
            }}
        );
    }
});

Meteor.methods({
    deleteServerGroup: function (groupId) {
        console.log("Removing server group with id: " + groupId);
        ServerGroups.remove({
            _id: groupId
        });
    }
});

Meteor.methods({
    deleteServer: function (id) {
        console.log("Removing server with id: " + id);
        Servers.remove({
            _id: id
        });
    }
});


Meteor.methods({
    addFavourite: function(userId, serverId) {
        console.log('adding favourite with userId:', userId, ' serverId:', serverId);
        Favourites.insert({
            userId: userId,
            serverId: serverId
        });
    },
    removeFavourite: function(userId, serverId) {
        console.log('removing favourite with userId:', userId, ' serverId:', serverId);
        Favourites.remove({
            userId: userId,
            serverId: serverId
        });
    }
});


//to be called by method methods to add session information to an object
var addSessionData = function(data) {
    data.timeStamp = new Date();
    data.userId = this.userId;
    data.sessionId = this.connection.id;
    data.clientAddress = this.connection.clientAddress;
    data.userAgent = this.connection.httpHeaders['user-agent'];
};


Meteor.methods({
    dispatch: function(eventName, data) {
        addSessionData.call(this, data);
        Bus.dispatch(eventName, data);
    }
});
