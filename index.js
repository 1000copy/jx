var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  },
  useNullAsDefault: true
});

(async()=>{	
	try{
		const cargo = [
		    { '#id':1,name: 'Audi', price: 52642 },
		    { '#id':2,name: 'Mercedes', price: 57127 },
		    { '#id':3,name: 'Skoda', price: 9000 },
		    { '#id':4,name: 'Volvo', price: 29000 },
		    { '#id':5,name: 'Bentley', price: 350000 },
		    { '#id':6,name: 'Citroen', price: 21000 },
		    { '#id':7,name: 'Hummer', price: 41400 },
		    { '#id':8,name: 'Volkswagen', price: 21600 },
		]
		await knex('cargo').del()
		await knex('cargo').insert(cargo)
		// console.log(await knex.from('cargo').select("*"))	
		const depot = [
		    { '#id':1,name: 'San Francisco'},
		    { '#id':2,name: 'Los Angles'},
		    { '#id':3,name: 'New York'},
		    { '#id':4,name: 'Houston'},
		]
		await knex('depot').del()
		await knex('depot').insert(depot)
		const stock = [
		    { '#id':1,'#depot':1,'#cargo':1,qty: 100,price:9000},
		    { '#id':2,'#depot':1,'#cargo':2,qty: 100,price:9000},
		    { '#id':3,'#depot':1,'#cargo':3,qty: 100,price:9000},
		    { '#id':4,'#depot':1,'#cargo':4,qty: 100,price:9000},
		]
		await knex('stock').del()
		await knex('stock').insert(stock)
		const sale = [
		    { '#id':1,'#depot':1},
		    { '#id':2,'#depot':1},
		    { '#id':3,'#depot':1},
		    { '#id':4,'#depot':1},		    
		]
		const sales = [
		    { '#id':1,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
		    { '#id':2,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
		]
		await knex('sale').del()
		await knex('sale').insert(sale)
		await knex('items').del()
		await knex('items').insert(sales)
		const buy = [
		    { '#id':1,'#depot':1},
		    { '#id':2,'#depot':1},
		    { '#id':3,'#depot':1},
		    { '#id':4,'#depot':1},		    
		]
		const buys = [
		    { '#id':3,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
		    { '#id':4,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
		]
		await knex('buy').del()
		await knex('buy').insert(buy)
		await knex('items').del()
		await knex('items').insert(buys)
	}catch(e){
		console.log(e)
	}finally{
		knex.destroy()
	}
})()




