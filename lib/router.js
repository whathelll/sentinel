Router.configure({
    layoutTemplate: 'layout'
});

Router.onBeforeAction(function(){
    console.log({url: this.url, params: this.params.query});
    Meteor.call('dispatch', 'page-view', {url: this.url, params: this.params.query});
    this.next();
}, {except: ['testRestful', 'testRestfulUpDown', 'testNoResponse']});

Router.route('/', function(){
    this.render('statusPage');
});


Router.route('/servergroup/:_id',
    function() {
        this.render('editServerGroup', {
            data: function() {
                return ServerGroups.findOne({_id: this.params._id});
            }
        })
    },
    {name: 'servergroup'}
);


Router.route('/eventlog/:_id',    {
        waitOn: function () {
            return Meteor.subscribe('eventLogForServer', this.params._id);
        },
        action: function() {
            this.render('eventLog', {
                data: {serverId: this.params._id}
            })
        },
        name: 'eventlog'
    }
);

Router.route('/about', function(){
    this.render('about');
});

Router.route('/favourites', function(){
    this.render('favourites');
});

Router.route('/statistics', {
    waitOn: function () {
        return Meteor.subscribe('eventLogPageView');
    },
    action: function() {
        this.render('statistics');
    },
    name: 'statistics'
});