const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, CartController.createCart);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, CartController.getAllCarts);
router.post('/me', AuthController.verifyToken, CartController.createMyCart);
router.get('/me', AuthController.verifyToken, CartController.getMyCart);
router.get('me/:id', AuthController.verifyToken, CartController.getMyCartById);
router.patch('/me/:id', AuthController.verifyToken, CartController.updateMyCart);
router.delete('/me/:id', AuthController.verifyToken, CartController.deleteMyCart);
router.get('/info/:id', AuthController.verifyToken, CartController.getCartInfoByCartId);
router.get('/user/:userId', AuthController.verifyToken, CartController.getCartByUserId);
router.get('/:id', AuthController.verifyToken, AuthController.requireAdmin, CartController.getCartById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, CartController.updateCart);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, CartController.deleteCart);

module.exports = router;