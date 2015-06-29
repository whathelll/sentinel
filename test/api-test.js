//this file is to set up endpoints so we can have test endpoints to hit against
var testRestResponse = {status: "up", version: "1.0.5"};

Router.map(function() {
    this.route('methodExample', {
        path: '/api/test/jsonstatus',
        where: 'server',
        action: function() {
            // GET, POST, PUT, DELETE
            var requestMethod = this.request.method;
            // Data from a POST request
            var requestData = this.request.body;
            // Could be, e.g. application/xml, etc.
            //this.response.writeHead(200, {'Content-Type': 'text/html'});
            //this.response.end('<html><body>Your request was a ' + requestMethod + '</body></html>');
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end(JSON.stringify(testRestResponse));
        }
    });
});

//alternate between versions
var versionSwitch = true;
Router.route('/api/test/restful', { where: 'server' })
    .get(function () {
        console.log('GET rest test api hit');
        //console.log(this.request);
        console.log('----------------------------');
        //console.log(this.response);
        if(versionSwitch) {
            testRestResponse.version = "1.0.6";
        } else {
            testRestResponse.version = "1.0.5";
        }
        versionSwitch = !versionSwitch;

        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(JSON.stringify(testRestResponse));

    })
    .post(function () {
        console.log('----------------------------');
        console.log('POST rest test api hit');
        //console.log(this.request.headers);
        //console.log(this.request.body);
        console.log('----------------------------');
        //console.log(this.response);

        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(JSON.stringify(testRestResponse));
    })
    .put(function () {
        console.log('----------------------------');
        console.log('PUT rest test api hit');
        //console.log(this.request);
        console.log('----------------------------');
        //console.log(this.response);

        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(JSON.stringify(testRestResponse));
    });


//alternate between up and down
var upSwitch = true;
Router.route('/api/test/restfulUpDown', { where: 'server' })
    .get(function () {
        console.log('GET rest test up down api hit');
        //console.log(this.request);
        console.log('----------------------------');
        //console.log(this.response);
        if(upSwitch) {
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end(JSON.stringify(testRestResponse));
        } else {
            this.response.writeHead(404, {});
            this.response.end("");
        }
        upSwitch = !upSwitch;



    });