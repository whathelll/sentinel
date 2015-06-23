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

Router.route('/api/test/restful', { where: 'server' })
    .get(function () {
        console.log('GET rest test api hit');
        //console.log(this.request);
        console.log('----------------------------');
        //console.log(this.response);

        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(JSON.stringify(testRestResponse));

    })
    .post(function () {
        console.log('POST rest test api hit');
        //console.log(this.request);
        console.log('----------------------------');
        //console.log(this.response);

        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(JSON.stringify(testRestResponse));
    })
    .put(function () {
        console.log('PUT rest test api hit');
        //console.log(this.request);
        console.log('----------------------------');
        //console.log(this.response);

        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(JSON.stringify(testRestResponse));
    });