Meteor.subscribe('servergroups');
Meteor.subscribe('servers');



if(Meteor.userId()) {
    Meteor.subscribe('favourites', Meteor.userId());
}




//Meteor.subscribe('eventLogPageView'); //moved to router
//Meteor.subscribe('eventLogForServer', this.params._id); //moved to router