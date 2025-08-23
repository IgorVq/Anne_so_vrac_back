const express = require('express');
const router = express.Router();
const CategoriesController = require('../controllers/categoriesControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, CategoriesController.createCategory);
router.get('/', CategoriesController.getAllCategories);
router.get('/available', CategoriesController.getAvailableCategories);
router.get('/:id', CategoriesController.getCategoryById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, CategoriesController.updateCategory);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, CategoriesController.deleteCategory);

module.exports = router;