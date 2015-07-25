Template.statistics.onCreated(function(){
    this.subscribe('statistics');
})

Template.statistics.helpers({
    events: function() {
        return EventLog.find({type: "page-view"}, {sort: {timeStamp: -1}});
    },
    stats: function() {
        var count = Statistics.findOne();
        var result = [];
        if(count) {
            delete count._id;
            result = Object.keys(count).map(function(key) {
                return {url: key, views: count[key]};
            })
        }
        result = _.sortBy(result, function(o) {
            return o.url;
        });
        return result;
    }
});



Template.pageView.helpers({
    formattedTimeStamp: function() {
        return this.timeStamp.toLocaleString();
    }
})