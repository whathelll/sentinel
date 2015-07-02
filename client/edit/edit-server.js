Template.editServer.events({
	"submit .edit-server": function (event) {
		var serverName = event.target.serverName.value;
		var pollInterval = event.target.pollInterval.value;
		var url =  event.target.url.value;
		var method = event.target.method.value;

		Meteor.call('editServer', this._id, serverName, url, pollInterval, method);

		event.target.serverName.value = "";
		event.target.pollInterval.value = "";
		event.target.url.value = "";
		event.target.method.value = "";

		return false;
	},
	"click .delete-server": function (event) {
		Meteor.call('deleteServer', this._id);
	}
});