
//HTTP.call("GET", "http://localhost:3000/api/test/jsonstatus")

var polling = true;


var count = 0;


/*
poll the server that's passed in
 */
var pollServer = function(server) {
    var options = {};
    var errorMessage = "";
    var originalStatus = server.upStatus;
    if(server.upStatusMethod == "POST") {
        options.headers = JSON.parse(server.upStatusPostHeader);
        options.content = server.upStatusPostData;
    }

    HTTP.call(server.upStatusMethod, server.upStatusUrl, options, function (error, result) {
        //console.log(server.upStatusUrl);
        if (!error) {
            console.log('---------------success Server:' + server.serverGroup + ' ' + server.name);
            console.log('Status Code:' + result.statusCode);
            //console.log('Content:' + result.content);

            //set the server version
            if(server.upStatusUrl === server.versionUrl) {
                var match = result.content.match(/ersion":"([a-zA-Z0-9\.]+)"/);
                if(match && match.length >= 2) {
                    server.version = match[1];
                }
            }
            //if post then check the result
            if(server.upStatusMethod === "POST") {
                console.log('testing post condition');
                console.log('match: ' + result.content.match(server.upStatusPostResultRegex));
                if(result.content && server.upStatusPostResultRegex) {
                    server.upStatus = !!result.content.match(server.upStatusPostResultRegex);
                }
            } else {
                //server is up
                server.upStatus = true;
            }
        } else {
            console.log('------------------------error: ' + server.serverGroup + ' ' + server.name);
            console.log(error);

            if(result) {
                errorMessage = JSON.stringify(result).substr(0, 250);
            } else {
                errorMessage = "Unknown";
            }
            //server is down
            server.upStatus = false;
        }

        var storedServer = Servers.findOne(server._id);
        if(storedServer.upStatus !== server.upStatus) Bus.dispatch('server-status-changed', server, errorMessage);
        if(storedServer.version !== server.version) Bus.dispatch('server-version-changed', server, server.version);

        server.lastUpdateTime = new Date();
        Servers.update(server._id,{$set: {
                upStatus: server.upStatus,
                version: server.version,
                lastUpdateTime: server.lastUpdateTime
            }}
        );

    });
}

/*loop through each servergroup and determine if we need to poll the server
 */
var poll = function() {
    ServerGroups.find().forEach(function(serverGroup){
        //console.log('----------------------polling for serverGroup:' + serverGroup.name + '--------------------------');
        Servers.find({serverGroup: serverGroup.name}).forEach(function(server){
            if(!server.pollInterval || !server.lastUpdateTime
                || (Date.now() - server.lastUpdateTime) > server.pollInterval*1000) {
                pollServer(server);
            }
        });
    });
}

/*
check for polling every x milliseconds
 */
var pollingTimer = Meteor.setInterval(poll, 5000);









//random test stuff
var callMeLaterAsync = function(name, cb) {
    setTimeout(function() {
        cb && cb(null, 'hey there, ' + name);
    }, 2000);
};

//call this on the client side with Meteor.call("poll"); on the client
Meteor.methods({
    poll: function(name) {
        callMeLaterAsync(name, function (err, res) {
            console.log(res);
        });
    }
});


exec = Npm.require('child_process').exec;
Meteor.methods({
    runCode: function () {
        // This method call won't return immediately, it will wait for the
        // asynchronous code to finish, so we call unblock to allow this client
        // to queue other method calls (see Meteor docs)
        //this.unblock();
        var command="dir";
        exec(command,function(error,stdout,stderr){
            if(error){
                console.log(error);
                throw new Meteor.Error(500,command+" failed");
            }
            console.log(stdout.toString());
        });
        return true;
    }
});