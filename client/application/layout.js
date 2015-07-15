//generic click event handler
Template.layout.events({
        'click a[tag], click button[tag]': function (event) {
            var tag = event.currentTarget.attributes.tag.value;
            var tagData = event.currentTarget.attributes["tag-data"].value;
            var data = {
                //type: 'page-action',
                actionType: event.type,
                baseUrl: event.currentTarget.baseURI,
                tag: tag,
                tagData: tagData
            }
            Meteor.call('dispatch', 'page-action', data);
            event.currentTarget.blur();
        }
    }
);

