#Install
download and install from http://www.meteor.com

clone this repository

type "meteor" in the command line to start up instance

"meteor reset" to reset the database

#Packages used
see .meteor/packages


#Custom CSS
put custom css in /client/lib/custom.site.less

#Where is what?
Routing - lib/router.js (see https://github.com/iron-meteor/iron-router)

templates - client/*

sample data - server/sample-data.js

polling logic - server/status-check.js

dev test endpoints - test/api-test.js


#To do
- have different operations e.g. post with data and header (doesn't seem to post the body yet)
- evaluate version with regular expression (a field on the server record)
- set up sample data that has VE132/133
- evaluate response content rather than just look at 200 status

- edit servers
- add servers
- add server groups

- short circuit mechanism
- an event bus

- server actions - stop/start with outputs
- view logs?
