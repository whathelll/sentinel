var methodChanged = new Tracker.Dependency();


Template.editServer.helpers({
	isShowPostComponents: function() {
		methodChanged.depend();
		return this.upStatusMethod == "POST";
	}
});


Template.editServer.events({
	"submit .edit-server": function (event) {
		var serverName = event.target.serverName.value;
		var pollInterval = event.target.pollInterval.value;
		var url =  event.target.url.value;
		var method = event.target.method.value;

		var postHeader =  event.target.postHeader.value || "";
		var postData = event.target.postData.value || "";
		var postRegex = event.target.postRegex.value || "";

		console.log(postData);
		console.log(postHeader);
		console.log(postRegex);

		Meteor.call('editServer', this._id, serverName, url, pollInterval, method, postHeader, postData, postRegex);
		return false;
	},
	"click .delete-server": function (event) {
		Meteor.call('deleteServer', this._id);
	},
	"change select": function (event) {
		this.upStatusMethod = event.target.value;
		methodChanged.changed();
	}
});