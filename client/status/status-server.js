Template.statusServer.helpers({
    updateTime: function() {
        return this.lastUpdateTime ? this.lastUpdateTime.toLocaleTimeString() : "";
    },
    updateStatus: function() {
        return this.upStatus ? "Up" : "Down";
    },
    statusClass: function() {
        return this.upStatus ? "label-success" : "label-danger";
    },
    isFavourite: function() {
        var favourite = Favourites.findOne({userId: Meteor.userId() || "", serverId: this._id});
        return Template.instance().isFavourite = !!favourite;
    },
    tag: function() {
        if(Template.instance().isFavourite) {
            return "unFavourite";
        } else {
            return "favourite";
        }
    }
});

Template.statusServer.events({
    "click .favourite": function (event, instance) {
        //console.log('favourite clicked on: ' + this._id);
        //console.log(arguments);
        //console.log(instance);
        if(instance.isFavourite) {
            Meteor.call('removeFavourite', Meteor.userId(), this._id);
        } else {
            Meteor.call('addFavourite', Meteor.userId(), this._id);
        }
    }
});