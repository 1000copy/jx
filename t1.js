var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  },
  useNullAsDefault: true
});
async function make() {
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
		]
		await knex('stock').del()
		await knex('stock').insert(stock)
}
(async()=>{	
	try{
		await make()
		async function post(id){
			var items = await knex({ a: 'sale', b: 'items' })
			  .select({
			  	id:'a.#id',
			    cargo: 'b.#cargo',
			    qty: 'b.qty'
			  })
			  //.whereRaw(`?? = ?? and '#id' = ${id}`, ['a.#id', 'b.#ref'])
			  // .whereRaw(`?? = ?? and a.'#id' = ${id}`, ['a.#id', 'b.#ref'])
			  .whereRaw(`?? = ?? and ?? = ??`, ['a.#id', 'b.#ref','a.#id',id])
			  // console.log("$",items)	  
			 for(const item of items){
			 		// console.log(item)	  
			 		// https://stackoverflow.com/questions/42212497/knex-js-how-to-update-a-field-with-an-expression
			 		// await knex("stock").decrement("qty",item.qty).where("#cargo",item.cargo)
			 	  // console.log("#……",item.cargo)	 
			 		await knex('stock').update({qty: knex.raw('?? - ??', ['qty',item.qty])}).where('#cargo',item.cargo)
			 }
			 
		}
		const assert = require('assert')
		function test1(){
			const sale = [
			    { '#id':1,'#depot':1},
			]
			const sales = [
			    { '#id':1,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
			    //{ '#id':2,'#ref':1,'#cargo':2,qty:1,price:9000,sum:9000},
			]
			await knex('sale').del()
			await knex('sale').insert(sale)
			await knex('items').del()
			await knex('items').insert(sales)
			// single bill detail
			// 过账并检查结果1
			await post(1)
			var s = await knex("stock").where("#id",1)
			assert(s[0].qty==99)	
		}
		function test2(){
			const sale = [
			    { '#id':1,'#depot':1},
			]
		  // double bill detail
			const sales = [
			    { '#id':1,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
			    { '#id':2,'#ref':1,'#cargo':2,qty:11,price:9000,sum:9000},
			]
			await knex('sale').del()
			await knex('sale').insert(sale)
			await knex('items').del()
			await knex('items').insert(sales)
			// 过账并检查结果2
			var s = await knex("stock").where("#id",1)
			// console.log(s)
			await post(1)
			var s = await knex("stock").where("#id",1)
			// console.log(s)
			assert(s[0].qty==98)
			var f = await knex("stock").where("#id",2)
			// console.log(f)
			assert(f[0].qty==89)
		}
		test1()
		test2()
		// DEBUG=knex:query node t1 环境变量可以调试SQL
	}catch(e){
		console.log(e)
	}finally{
		knex.destroy()
	}
})()

/*
git config --global alias.a '!f() { git commit -am "$1" && git push; }; f'

# then use it with
git a "My message is awesome."

*/

