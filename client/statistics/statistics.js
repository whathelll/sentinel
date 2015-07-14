Template.statistics.helpers({
    events: function() {
        return EventLog.find({type: "page-view"}, {sort: {timeStamp: -1}});
    }
});



Template.pageView.helpers({
    formattedTimeStamp: function() {
        return this.timeStamp.toLocaleString();
    }
})