const db = require('../db/db');
const Joi = require('joi');
const { attachPaginate } = require('knex-paginate');

attachPaginate();

//Per page pagination count
const PER_PAGE_PAGINATION = 4;

//POST request validation schema
const schema = {
	name: Joi.string().min(3).required(),
	price: Joi.number().required(),
	quantity: Joi.number().integer().required(),
}

class ProductsController {
	//Create single product
	async createProduct(req,res){
		const result = Joi.validate(req.body, schema);
		try{
			if(result.error === null){
				const { name, price,quantity } = req.body
				await db('products').insert({
					name: name,
					price:price,
					quantity: quantity,
				});
				res.redirect('/api/products');
			}else{
				res.status(400).json({success: false, message: 'Post validation falied, check datas and try again'})
			}
		}catch(err ){
			console.log(err);
		}
	}

	//Return list of products
	async getProducts(req,res){
		let current_page = req.query.page || 1;
		try{
			await db('products')
			  .select({
			    id: 'id',
			    name: 'name',
			    price: 'price',
			    quantity: "quantity"	
			  }).orderBy('id','asc').paginate({ perPage: PER_PAGE_PAGINATION, currentPage: current_page })
			  .then((products) => {
			    res.json(products.data);
			  })
			  .catch((err) => {
			    console.error(err);
			    res.json({success: false, message: 'An error occurred.'});
			  })
		}catch(e){
			console.log(e);
		}
	}

	//Send JSON data obout product by id
	async getProductById(req,res){
		let id = req.params.id;
		await db.select('*').from('products').where('id',id).then((product)=>{
			if(product.length){
				res.json(product)
			}else{
				res.status(404).json({success: false, message: 'No model found by this id.'});
			}
		})
	}

	//Update single project
	async updateProductById(req,res){
		let id = req.params.id;
		const {name,price,quantity} = req.body;
		const result = Joi.validate(req.body, schema);
		if(result.error == null){
			await db('products').where('id',id).update({
				name: name,
				price: price,
				quantity: quantity
			})
			await db.select('*').from('products').where('id',id).then((product)=>{
				res.json(product);
			})
		}else{
			res.status(400).json({success: false, message: 'Post validation falied, check datas and try again'})
		}
	}
	//Delete product
	async deleteProduct(req,res){
		let id = req.params.id;
		console.log(id);
		//Deleting all related images to product
		await db('images').where('parent_id', id).del();
		//Deleting product
		await db('products').where('id', id).del();
		res.redirect('/api/products');
	}
} 


module.exports = new ProductsController();