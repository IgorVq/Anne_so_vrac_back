const express = require('express');
const router = express.Router();
const PromoCodeController = require('../controllers/promoCodeControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, PromoCodeController.createPromoCode);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, PromoCodeController.getAllPromoCodes);
router.get('/code/:code', AuthController.verifyToken, PromoCodeController.getPromoCodeByCode);
router.get('/validity/:code', AuthController.verifyToken, PromoCodeController.checkPromoCodeValidity);
router.get('/:id', AuthController.verifyToken, PromoCodeController.getPromoCodeById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, PromoCodeController.updatePromoCode);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, PromoCodeController.deletePromoCode);

module.exports = router;