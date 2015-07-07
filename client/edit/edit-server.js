Template.editServer.events({
	"submit .edit-server": function (event) {
		var serverName = event.target.serverName.value;
		var pollInterval = event.target.pollInterval.value;
		var url =  event.target.url.value;
		var method = event.target.method.value;
		var postHeader = event.target.postHeader.value;
		var postData = event.target.postData.value;
		var postRegex = event.target.postRegex.value;
		var versionURL = event.target.versionURL.value;

		Meteor.call('editServer', this._id, serverName, url, pollInterval, method, postHeader, postData, postRegex, versionURL);

		event.target.serverName.value = "";
		event.target.pollInterval.value = "";
		event.target.url.value = "";
		event.target.method.value = "";
		event.target.postHeader.value = "";
		event.target.postData.value = "";
		event.target.postRegex.value = "";
		event.target.versionURL.value = "";

		return false;
	},
	"click .delete-server": function (event) {
		Meteor.call('deleteServer', this._id);
	}
});
