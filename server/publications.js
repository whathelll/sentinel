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
    return Favourites.find({userId: userId});
});



Meteor.publish('eventLogPageView', function() {
    return EventLog.find({type: "page-view"}, {sort: {timeStamp: -1}, limit: 50});
})



// server: publish the current size of a collection
Meteor.publish("statistics", function () {
    var self = this;
    var count = 0;
    var initializing = true;

    // observeChanges only returns after the initial `added` callbacks
    // have run. Until then, we don't want to send a lot of
    // `self.changed()` messages - hence tracking the
    // `initializing` state.
    var handle = EventLog.find({}).observeChanges({
        added: function (id) {
            count++;
            if (!initializing)
                self.changed("statistics", "count", {count: count});
        },
        removed: function (id) {
            count--;
            self.changed("statistics", "count", {count: count});
        }
        // don't care about changed
    });

    // Instead, we'll send one `self.added()` message right after
    // observeChanges has returned, and mark the subscription as
    // ready.
    initializing = false;
    self.added("statistics", "count", {count: count});
    self.ready();

    // Stop observing the cursor when client unsubs.
    // Stopping a subscription automatically takes
    // care of sending the client any removed messages.
    self.onStop(function () {
        handle.stop();
    });
});