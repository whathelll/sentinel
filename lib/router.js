Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function(){
    this.render('statusPage');
});



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
            this.response.end('status:true');
        }
    });
});