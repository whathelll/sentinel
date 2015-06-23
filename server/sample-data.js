if(ServerGroups.find().count() === 0) {
    ServerGroups.insert({
        name: 'localhost'
    });

    Servers.insert({
        name: 'test server 1',
        serverGroup: 'localhost',
        url: 'http://localhost:3000/api/test/restful'
    });

    Servers.insert({
        name: 'test server 2',
        serverGroup: 'localhost',
        url: 'http://localhost:3000/api/test/restful'
    });


    ServerGroups.insert({
        name: 'localhost2'
    });

    Servers.insert({
        name: 'test server 1',
        serverGroup: 'localhost2',
        url: 'http://localhost:3000/api/test/restful'
    });

    Servers.insert({
        name: 'test server 2',
        serverGroup: 'localhost2',
        url: 'http://localhost:3000/api/test/restful'
    });
}





