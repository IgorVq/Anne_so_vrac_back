const express = require('express');
const router = express.Router();
const FormatController = require('../controllers/formatControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, FormatController.createFormat);
router.get('/', FormatController.getAllFormats);
router.get('/product/:id', FormatController.getFormatByProductId);
router.get('/productSize/:id', FormatController.getProductSizeByProductId);
router.get('/size/:id', FormatController.getFormatByProductSizeId);
router.delete('/:productId/:productSizeId', AuthController.verifyToken, AuthController.requireAdmin, FormatController.deleteFormat);

module.exports = router;