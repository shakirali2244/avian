module.exports = {
	knex : require('knex')({
	  client: 'pg',
	  connection: {
	    host     : '',
	    user     : '',
	    password : '',
	    database : ''
	  }
	})
}