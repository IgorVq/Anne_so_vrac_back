const express = require('express');
const router = express.Router();
const CredentialsController = require('../controllers/credentialsControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, CredentialsController.createCredential);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, CredentialsController.getAllCredentials);
router.get('/:id', AuthController.verifyToken, AuthController.requireAdmin, CredentialsController.getCredentialById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, CredentialsController.updateCredential);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, CredentialsController.deleteCredential);

module.exports = router;