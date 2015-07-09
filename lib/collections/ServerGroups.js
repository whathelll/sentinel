ServerGroups = new Mongo.Collection("ServerGroups");

Servers = new Mongo.Collection("Servers");

//sample objs
//ServerGroups.insert({
//    name: 'localhost'
//});

//Servers.insert({
//    name: 'test server version change',
//    serverGroup: 'localhost',
//    pollInterval: 14,  //no. of seconds
//    upStatus: true,
//    upStatusUrl: 'http://127.0.0.1:3000/api/test/restful',
//    upStatusMethod: "GET",  //GET or POST
//    upStatusPostHeader: undefined,
//    upStatusPostData: undefined,
//    upStatusPostResultRegex: undefined,
//    version: "",
//    versionUrl: 'http://127.0.0.1:3000/api/test/restful',
//    lastUpdateTime: undefined
//});