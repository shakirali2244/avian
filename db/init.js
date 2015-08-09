// import the connection from knex constructor
con = require('./localconfig.js');


// DOCS http://knexjs.org/#Schema
con.knex.schema.createTable('user', function(table) {
	table.increments().primary();
	table.string('email').unique();
	table.string('hash');
	table.string('salt');

	})

	.createTable('drone', function(table) {
	table.increments();
	table.string('ip_addr');
	table.string('name');
	table.bigInteger('uid').references('id').inTable('user');
	})

	
	
	.catch(function(e) {
  	console.error(e);
	})
	.then(function(){
	console.log("DB initialized - everything is OK!")
	process.exit();
	});


