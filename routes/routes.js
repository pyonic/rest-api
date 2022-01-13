const db  = require('../db/db');
const multer  = require('multer');
const express = require('express');
const productsController = require('../controllers/products');
const imagesController = require('../controllers/images');

const router = express.Router();

//Setting multer configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix+file.originalname)
  }
})
const upload = multer({ storage: storage })

//Get list of products
router.get('/api/products',productsController.getProducts);
//Get product by id
router.get('/api/product/:id',productsController.getProductById);
//Update product by id
router.put('/api/product/:id',productsController.updateProductById);
// Create new product
router.post('/api/products', productsController.createProduct);
//Delete product
router.get('/api/product/del/:id',productsController.deleteProduct);
// Get product images list
router.get('/api/images/:product_id',imagesController.getProductImages);
// Upload product image
router.post('/api/images/:parent_id',upload.single('image'),imagesController.uploadImage);

module.exports = router;