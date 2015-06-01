Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function(){
    this.render('statusPage');
});


Router.route('/servergroup/:_id', function() {
    this.render('editServerGroup', {
        data: function() {
            return ServerGroups.findOne({_id: this.params._id});
        }
    })
    },
    {name: 'servergroup'}
);
