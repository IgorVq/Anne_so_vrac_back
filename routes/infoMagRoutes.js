const express = require('express');
const router = express.Router();
const InfoMagController = require('../controllers/infoMagControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, InfoMagController.createInfoMag);
router.get('/', InfoMagController.getAllInfoMags);
router.get('/:id', InfoMagController.getInfoMagById);
router.get('/topBanner', InfoMagController.getTopBannerMessages);

// Routes spécifiques pour les messages topbar
router.get('/topbar/messages', InfoMagController.getTopbarMessages);
router.post('/topbar', AuthController.verifyToken, AuthController.requireAdmin, InfoMagController.createTopbarMessage);
router.patch('/topbar/:id', AuthController.verifyToken, AuthController.requireAdmin, InfoMagController.updateTopbarMessage);
router.delete('/topbar/:id', AuthController.verifyToken, AuthController.requireAdmin, InfoMagController.deleteTopbarMessage);

router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, InfoMagController.updateInfoMag);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, InfoMagController.deleteInfoMag);

module.exports = router;