if(ServerGroups.find().count() === 0) {
    ServerGroups.insert({
        name: 'localhost'
    });

    Servers.insert({
        name: 'test server version change',
        serverGroup: 'localhost',
        pollInterval: 14,  //no. of seconds
        upStatus: true,
        upStatusUrl: 'http://127.0.0.1:3000/api/test/restful',
        upStatusMethod: "GET",  //GET or POST
        upStatusPostHeader: undefined,
        upStatusPostData: undefined,
        upStatusPostResultRegex: undefined,
        version: "",
        versionUrl: 'http://127.0.0.1:3000/api/test/restful',
        lastUpdateTime: undefined
    });

    Servers.insert({
        name: 'test server up down',
        serverGroup: 'localhost',
        pollInterval: 9,
        upStatus: false,
        upStatusUrl: 'http://127.0.0.1:3000/api/test/restfulUpDown',
        upStatusMethod: "GET",
        upStatusPostHeader: undefined,
        upStatusPostData: undefined,
        upStatusPostResultRegex: undefined,
        version: "",
        versionUrl: 'http://127.0.0.1:3000/api/test/restfulUpDown',
        lastUpdateTime: undefined
    });

    Servers.insert({
        name: 'test server post',
        serverGroup: 'localhost',
        pollInterval: 4,
        upStatus: false,
        upStatusUrl: 'http://127.0.0.1:3000/api/test/restful',
        upStatusMethod: "POST",
        upStatusPostHeader: '{"testField": "abc"}',
        upStatusPostData: "some data to be posted",
        upStatusPostResultRegex: undefined,
        version: "",
        versionUrl: undefined,
        lastUpdateTime: undefined
    });




}





