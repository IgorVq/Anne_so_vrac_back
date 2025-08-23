const express = require('express');
const router = express.Router();
const ImagesController = require('../controllers/imagesControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, ImagesController.createImage);
router.get('/', ImagesController.getAllImages);
router.get('/:id', ImagesController.getImageById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, ImagesController.updateImage);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, ImagesController.deleteImage);

module.exports = router;