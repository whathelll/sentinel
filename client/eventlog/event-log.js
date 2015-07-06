Template.eventLog.helpers({
    eventLogs: function() {
        return EventLog.find({serverId: this.serverId}, {sort: {timeStamp: -1}});
    }
});


Template.eventLogItem.helpers({
    formattedTimeStamp: function() {
        return this.timeStamp.toLocaleString();
    }
})