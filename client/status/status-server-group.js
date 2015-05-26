Template.statusServerGroup.helpers({
    servers: function() {
        return Servers.find({serverGroup: this.name})
    }
})