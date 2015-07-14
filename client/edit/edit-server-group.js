Template.editServerGroup.events({
	"submit .edit-server-group": function (event) {
		var groupName = event.target.groupName.value;

		if (this.name) {
			Meteor.call('editServerGroup', this.name, groupName);
		} else {
			Meteor.call('addServerGroup', groupName);
		}

		event.target.groupName.value = "";

	},
	"click .add-server": function (event) {
		Meteor.call('addServer', this.name);
	}
});

Template.editServerGroup.helpers({
	servers: function() {
        return Servers.find({serverGroup: this.name})
    }
});