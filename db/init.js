// import the connection from knex constructor
con = require('./localconfig.js');


// DOCS http://knexjs.org/#Schema
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
	})
	.then(function(){
	console.log(" EXITING")
	process.exit();
	});


