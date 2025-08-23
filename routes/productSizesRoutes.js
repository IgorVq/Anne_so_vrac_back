const express = require('express');
const router = express.Router();
const ProductSizesController = require('../controllers/productSizesControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, ProductSizesController.createProductSize);
router.get('/', ProductSizesController.getAllProductSizes);
router.get('/:id', ProductSizesController.getProductSizeById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, ProductSizesController.updateProductSize);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, ProductSizesController.deleteProductSize);

module.exports = router;