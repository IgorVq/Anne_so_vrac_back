const express = require('express');
const router = express.Router();
const ProductImageController = require('../controllers/productImageControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, ProductImageController.createProductImage);
router.get('/', ProductImageController.getAllProductImages);
router.get('/product/:id', ProductImageController.getProductImagesByProductId);
router.delete('/:productId/:imageId', AuthController.verifyToken, AuthController.requireAdmin, ProductImageController.deleteProductImage);

module.exports = router;