// import the connection from knex constructer
con = require('./localconfig.js');

con.knex.schema.createTable('drone', function(table) {
	table.string('ip_addr');
	table.string('name');
	})

	.createTable('user', function(table) {
	table.string('email').unique();
	table.string('hash');
	table.string('salt');
	})
	
	.catch(function(e) {
  console.error(e);
});
