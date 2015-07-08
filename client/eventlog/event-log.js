Template.eventLog.helpers({
    eventLogs: function() {
        return EventLog.find({serverId: this.serverId}, {sort: {timeStamp: -1}});
    }
});


Template.eventLogItem.helpers({
    formattedTimeStamp: function() {
        return this.timeStamp.toLocaleString();
    },
    eventClass: function() {
        if(this.event == "Status changed to Up") {
            return "bg-success";
        } else if(this.event == "Status changed to Down") {
            return "bg-danger";
        } else if(this.event == "Version Change") {
            return "bg-info";
        }
    }
})