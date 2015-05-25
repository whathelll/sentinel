if(ServerGroups.find().count() === 0) {
    ServerGroups.insert({
        name: 'localhost'
    });

    Servers.insert({
        serverGroup: 'localhost',
        url: 'http://localhost:3000/api/status'
    });
}