
exports.up = function(knex) {
    return knex.schema.createTable('products', table=>{
	  	table.increments('id');
	  	table.string('name',255).notNullable();
	  	table.decimal('price').notNullable();
	  	table.integer('quantity');
	  	table.timestamps(true,true);
	  })
	  .createTable('images', table=>{
	  	table.increments('id');
	  	table.integer('parent_id');
	  	table.text('image_url');
	  });
};

exports.down = function(knex) {
	knex.schema.dropTableIfExists('products').dropTableIfExists('images');
};
