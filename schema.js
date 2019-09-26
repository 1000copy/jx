var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  },
  useNullAsDefault: true
});

(async()=>{	
	var tablename = 'cargo'
	await knex.schema.dropTableIfExists(tablename)
	await knex.schema.createTable(tablename, (t) => {
	    t.increments('#id')
	    t.string('name')
	    t.decimal('price')
	})
	var tablename = 'depot'
	await knex.schema.dropTableIfExists(tablename)
	await knex.schema.createTable(tablename, (t) => {
	    t.increments('#id')
	    t.string('name')	    
	})	
	var tablename = 'stock'
	await knex.schema.dropTableIfExists(tablename)
	await knex.schema.createTable(tablename, (t) => {
	    t.increments('#id')
	    t.integer('#depot')
	    t.integer('#cargo')
	    t.decimal('qty')
	    t.decimal('price')	    
	})
	var tablename = 'sale'
	await knex.schema.dropTableIfExists(tablename)
	await knex.schema.createTable(tablename, (t) => {
	    t.increments('#id')
	    t.string('#depot')
	    t.integer('memo')
	})
	var tablename = 'buy'
	await knex.schema.dropTableIfExists(tablename)
	await knex.schema.createTable(tablename, (t) => {
	    t.increments('#id')
	    t.string('#depot')
	    t.integer('memo')
	})
	var tablename = 'items'
	await knex.schema.dropTableIfExists(tablename)
	await knex.schema.createTable(tablename, (t) => {
	    t.increments('#id')
	    t.integer('#ref')
	    t.integer('#cargo')
	    t.decimal('qty')
	    t.decimal('price')
	    t.decimal('sum')
	})	
	knex.destroy()
})()
