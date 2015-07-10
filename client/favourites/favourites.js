Template.favourites.helpers({
    servers: function() {
        var listOfFavourites = Favourites.find({userId: Meteor.userId()}).map(function(favourite) {
            return favourite.serverName;
        });
        //console.log(listOfFavourites);
        var listOfServers = Servers.find({name: {$in: listOfFavourites}}).map(function(server) {
            server.name = server.serverGroup + ": " + server.name;
            return server;
        });
        //console.log('listOfServers:', listOfServers);
        return listOfServers;
    }
});