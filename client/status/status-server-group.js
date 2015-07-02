Template.statusServerGroup.helpers({
    servers: function() {
        return Servers.find({serverGroup: this.name})
    },
    totalUpDown: function() {
        var up = 0;
        var total = 0;
        var servers = Servers.find({serverGroup: this.name});  //hmmm inefficient
        servers.forEach(function(server) {
                if(server.upStatus) up++;
                total++;
            }
        );
        return up + "/" + total;
    }
});

Template.statusServerGroup.events({
    "click .delete-group": function (event) {
        Meteor.call('deleteServerGroup', this._id);
    }
});