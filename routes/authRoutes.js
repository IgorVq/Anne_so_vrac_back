const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authControllers');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;