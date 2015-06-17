
//HTTP.call("GET", "http://localhost:3000/api/test/jsonstatus")

var polling = true;


var count = 0;

var poll = function() {

    ServerGroups.find().forEach(function(serverGroup){
        console.log('----------------------polling for serverGroup:' + serverGroup.name + '--------------------------');
        Servers.find({serverGroup: serverGroup.name}).forEach(function(server){

            HTTP.get(server.url, {}, function (error, result) {
                console.log(server.url);
                if (!error) {
                    console.log('Server:' + server.name);
                    console.log('Status Code:' + result.statusCode);
                    console.log('Content:' + result.content);
                } else {
                    console.log(error);
                }
            });
        });
    });
    if(count++ > 3) polling = false;
    if(!polling) {
        Meteor.clearInterval(pollingTimer);
    }
}


var pollingTimer = Meteor.setInterval(poll, 5000);












var callMeLaterAsync = function(name, cb) {
    setTimeout(function() {
        cb && cb(null, 'hey there, ' + name);
    }, 2000);
};


Meteor.methods({
    poll: function(name) {
        callMeLaterAsync(name, function (err, res) {
            console.log(res);
        });
    }

});

