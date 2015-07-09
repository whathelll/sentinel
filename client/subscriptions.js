Meteor.subscribe('servergroups');
Meteor.subscribe('servers');



if(Meteor.userId()) {
    Meteor.subscribe('favourites', Meteor.userId());
}