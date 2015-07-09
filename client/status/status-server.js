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
        var id = Meteor.userId() || "";
        //console.log('id:', id, ' name:', this.name);
        var favourite = Favourites.findOne({userId: Meteor.userId() || "", serverName: this.name});
        //console.log('favourite:', favourite);
        return Template.instance().isFavourite = !!favourite;
    }
});

Template.statusServer.events({
    "click .favourite": function (event, instance) {
        //console.log('favourite clicked on: ' + this._id);
        //console.log(arguments);
        //console.log(instance);
        if(instance.isFavourite) {
            Meteor.call('removeFavourite', Meteor.userId(), this.name);
        } else {
            Meteor.call('addFavourite', Meteor.userId(), this.name)
        }
    }
});