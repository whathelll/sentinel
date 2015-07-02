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
- set up sample data that has VE132/133
- user accounts and subscription to server status

- edit servers (part)
- add servers (part)
- add server groups (part)
- event log (still simple)

- server actions - stop/start with outputs
- view logs?
