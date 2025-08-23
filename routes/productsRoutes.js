const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/productsControllers');
const AuthController = require('../controllers/authControllers');

// Routes existantes
router.post('/', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.createProduct);
router.get('/', ProductsController.getAllProducts);
router.get('/available', ProductsController.getAvailableProductsId);
router.get('/available/promo', ProductsController.getAvailablePromoProductsId);
router.get('/available/local', ProductsController.getAvailableLocalProductsId);
router.get('/available/category/:categoryId', ProductsController.getAvailableProductsByCategoryId);
router.get('/card/:id', ProductsController.getProductCardInfoById);

// Nouvelles routes admin (doivent être AVANT les routes génériques avec :id)
router.get('/admin', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.getAllProductsForAdmin);
router.get('/admin/:id', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.getProductForAdmin);
router.post('/admin', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.createProductAdmin);
router.patch('/admin/:id', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.updateProductAdmin);
router.delete('/admin/:id', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.deleteProductAdmin);

// Routes génériques (doivent être APRÈS les routes admin)
router.get('/:id', ProductsController.getProductById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.updateProduct);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, ProductsController.deleteProduct);

module.exports = router;