1. 'npm install -g grunt-cli bower yo generator-karma generator-angular' - install grunt-cli yo and generators

1. `cd avian-api` 

1. `npm install` - install the root package dependencies

1. `sudo su postgres` - switch to postgres user

1. Create an account in your postgresql database with ex: name avian and password avian and create a database named "avian-api" with avian as the owner and edit `db/localconfig.js`

1. `createuser --createdb --createrole --superuser --pwprompt --echo avian`

1. `createdb --owner=avian --echo "avian-api"`

1. `psql` - check that AvianServer and admin is listed in list of databases with `\l`

1. `service postgresql status` - make sure postgresql is running

1. `exit` - switch back to dev user

1. `node db/init.js` - init the db

1. 'grunt' - build the front end app

1. `node .` - start the server

#
#TODO 
- add Bcrypt integration
- link passort local strategy with users table  
