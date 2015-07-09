Router.configure({
    layoutTemplate: 'layout'
});

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