const db = require('../db/db');

class ImagesController{
	//Upload image
	async uploadImage(req,res){
		let filedata = req.file;
		let parent = req.params.parent_id;
	    if(filedata){
		    	await db('images').insert({
		    		parent_id : parent,
		    		image_url : req.file.filename
		    	})
			    await db.select('*').from('images').where('parent_id',parent).then((images)=>{
			        res.json(images);

			    })
		}else{
	        res.json({success: false, message: 'Error'});
	    }
	}
	async getProductImages(req,res){
		let product_id = req.params.product_id;
		await db.select('*').from('images').where('parent_id',product_id).then((images)=>{
				res.json(images);
		})
	}
}

module.exports = new ImagesController();