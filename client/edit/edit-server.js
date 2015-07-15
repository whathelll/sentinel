var methodChanged = new Tracker.Dependency();
var method={};

Template.editServer.helpers({
	isShowPostComponents: function() {
		methodChanged.depend();
		method[this._id] = method[this._id] || this.upStatusMethod;
		return method[this._id] == "POST";
	}
});


Template.editServer.events({
	"submit .edit-server": function (event) {
		var serverName = event.target.serverName.value;
		var pollInterval = event.target.pollInterval.value;
		var url =  event.target.url.value;
		var versionUrl = event.target.versionUrl.value;
		var method = event.target.method.value;

		var postHeader =  event.target.postHeader.value || "";
		var postData = event.target.postData.value || "";
		var postRegex = event.target.postRegex.value || "";

		Meteor.call('editServer', this._id, serverName, url, versionUrl, pollInterval, method, postHeader, postData, postRegex);
	},
	"click .delete-server": function (event) {
		Meteor.call('deleteServer', this._id);
	},
	"change select": function (event) {
		method[this._id] = event.target.value;
		methodChanged.changed();
	}
});