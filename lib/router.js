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


Router.route('/eventlog/:_id',
    function(){
        this.render('eventLog', {
            data: {serverId: this.params._id}
        })
    },
    {name: 'eventlog'}
);