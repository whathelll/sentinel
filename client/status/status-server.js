Template.statusServer.helpers({
    updateTime: function() {
        return this.lastUpdateTime ? this.lastUpdateTime.toLocaleTimeString() : "";
    },
    updateStatus: function() {
        return this.upStatus ? "Up" : "Down";
    },
    statusClass: function() {
        return this.upStatus ? "label-success" : "label-danger";
    }
});