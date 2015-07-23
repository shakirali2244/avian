cd avian-api
npm install
cp db/init.js db/init.local.js
echo "db/init.js" >> .gitignore
create role with password and create db
fill in psql role, pass, dbname in init.local.js
node db/init.locl.js

#TODO
- link passort local strategy with users table
- add angular
