const express = require('express');
const router = express.Router();
const DiscountsController = require('../controllers/discountsControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, DiscountsController.createDiscount);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, DiscountsController.getAllDiscounts);
router.get('/product/:productId', AuthController.verifyToken, AuthController.requireAdmin, DiscountsController.getDiscountsByProduct);
router.get('/:id', AuthController.verifyToken, AuthController.requireAdmin, DiscountsController.getDiscountById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, DiscountsController.updateDiscount);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, DiscountsController.deleteDiscount);

module.exports = router;