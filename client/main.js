//generic helpers
Template.registerHelper('equals',
    function(value1, value2) {
        return value1 == value2;
    }
);

Meteor.startup(function() {
    $('body').attr('unresolved', 'true');
});