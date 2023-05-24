
var knex = require('knex')({client: 'sqlite3',
					 connection: {filename: "./mydb.sqlite" },useNullAsDefault: true});
(async()=>{	
	try{
		await make()
		await test1()
		await test2()
		await test3()
		await t4()
		await t5()
		await test6()
	}catch(e){
		console.log(e)
	}finally{
		knex.destroy()
	}
})()

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
		const stock = [
		    { '#id':1,'#cargo':1,qty: 100,price:9000},
		    { '#id':2,'#cargo':2,qty: 100,price:9000},
		    { '#id':3,'#cargo':3,qty: 100,price:9000},
		]
		await knex('stock').del()
		await knex('stock').insert(stock)
}
class Sale{
	constructor(id){
		this.id = id
	}
	async post(){
				let id = this.id 
				var sales = await knex({ a: 'sale', b: 'sales' })
				  .select({
				  	id:'a.#id',
				    cargo: 'b.#cargo',
				    qty: 'b.qty'
				  })
				  //.whereRaw(`?? = ?? and '#id' = ${id}`, ['a.#id', 'b.#ref'])
				  // .whereRaw(`?? = ?? and a.'#id' = ${id}`, ['a.#id', 'b.#ref'])
				  .whereRaw(`?? = ?? and ?? = ??`, ['a.#id', 'b.#ref','a.#id',id])
			knex.transaction(async function(knex) {
				 for(const item of sales){
				 		// console.log(item)	  
				 		// https://stackoverflow.com/questions/42212497/knex-js-how-to-update-a-field-with-an-expression
				 		// await knex("stock").decrement("qty",item.qty).where("#cargo",item.cargo)
				 	  // console.log("#……",item.cargo)	 
				 		await knex('stock').update({qty: knex.raw('?? - ??', ['qty',item.qty])}).where('#cargo',item.cargo)
				 		var stockn = await knex('stock').select({qty: 'qty'}).whereRaw(`?? = ??`, ['#cargo',item.cargo])
						// console.log(stockn)
						let nqty = stockn[0]['qty']
						// assert(nqty==-1)
						if (nqty < 0  ){
							await knex.rollback('neglect stock')
						}	
				 }
				 await knex.commit()
			}).catch(function(error) {
			  console.error(error);
			})
	}
}
async function post(id){
			let sale = new Sale(id)
			await sale.post()
		}

const assert = require('assert')
		async function test1(){
			const sale = [
			    { '#id':1,},
			]
			const sales = [
			    { '#id':1,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
			    //{ '#id':2,'#ref':1,'#cargo':2,qty:1,price:9000,sum:9000},
			]
			await knex('sale').del()
			await knex('sale').insert(sale)
			await knex('sales').del()
			await knex('sales').insert(sales)
			// single bill detail
			// 过账并检查结果1
			await post(1)
			var s = await knex("stock").where("#id",1)
			console.log(s)
			assert(s[0].qty==99)	
}
async function test2(){
	const sale = [
	    { '#id':1},
	]
  // double bill detail
	const sales = [
	    { '#id':1,'#ref':1,'#cargo':1,qty:1,price:9000,sum:9000},
	    { '#id':2,'#ref':1,'#cargo':2,qty:11,price:9000,sum:9000},
	]
	await knex('sale').del()
	await knex('sale').insert(sale)
	await knex('sales').del()
	await knex('sales').insert(sales)
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
async function test3(){
	const sale = [
	    { '#id':1},
	]
	const sales = [
	    { '#id':1,'#ref':1,'#cargo':3,qty:101,price:9000,sum:9000},
	]
	await knex('sale').del()
	await knex('sale').insert(sale)
	await knex('sales').del()
	await knex('sales').insert(sales)
	// single bill detail
	// 过账并检查结果1
	await post(1)
	var s = await knex("stock").where("#cargo",3)
	// console.log(s)
	assert(s[0].qty==100)	
}
async function t4(){
	let cargo = 3;let qty = 101
	await knex('stock').
		//returning("qty").
		update({qty: knex.raw('?? - ??', ['qty',qty])}).where('#cargo',cargo)
	var sales = await knex('stock')
	  .select({
	  	id:'#id',
	    cargo: '#cargo',
	    qty: 'qty'
	  })
	  .whereRaw(`?? = ??`, ['#cargo',cargo])
	// console.log(sales)
	let nqty = sales[0]['qty']
	assert(nqty==-1)
}
async function t5(){
	knex.transaction(async function(knex) {
		let cargo = 1;let qty = 109
		await knex('stock').
			//returning("qty").
			update({qty: knex.raw('?? - ??', ['qty',qty])}).where('#cargo',cargo)
		var sales = await knex('stock').select({qty: 'qty'}).whereRaw(`?? = ??`, ['#id',1])
		// console.log(sales)
		let nqty = sales[0]['qty']
		// assert(nqty==-1)
		if (nqty == -1 ){
			await knex.rollback('neglect stock')
		}	else {
			await knex.commit()
		}
		var sales = await knex('stock').select({qty: 'qty'}).whereRaw(`?? = ??`, ['#id',1])
		let n = sales[0]['qty']
		assert(n == -9)
	}).catch(function(error) {
	  console.error(error);
	})
	
}
async function test6(){
	await make()
	const sale = [
	    { '#id':1},
	]
  // double bill detail
	const sales = [
	    { '#id':1,'#ref':1,'#cargo':1,qty:99,price:9000,sum:9000},
	    { '#id':2,'#ref':1,'#cargo':2,qty:101,price:9000,sum:9000},
	]
	await knex('sale').del()
	await knex('sale').insert(sale)
	await knex('sales').del()
	await knex('sales').insert(sales)
	// 过账并检查结果2
	await post(1)
	var s = await knex("stock").where("#cargo",1)
	console.log(s)
	assert(s[0].qty==100)
	var s = await knex("stock").where("#cargo",2)
	console.log(s)
	assert(s[0].qty==100)
}
/*
## how to debug sql?

DEBUG=knex:query node t1

 环境变量可以调试SQL

## todo - 去掉仓库depot，按MVP的来

## 在过账时，如果遇到负库存，应该自动回滚事务

## make alias for add . && commit -m"message" && git push to git a message

git config --global alias.a '!f() { git commit -am "$1" && git push; }; f'

# then use it with
git a "My message is awesome."
git a  nospacemessage
git a  w无空格中文

## How to page down in sublime text in Mac OS X?

Just using Fn+up to pageup and Fn+down to pagedown

## how to debug transaction

Transaction query already complete, run with DEBUG=knex:tx

## update can return column for sqlite?
	 .returning() is not supported by sqlite3 and will not have any effect.
*/

