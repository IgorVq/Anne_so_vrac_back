const express = require('express');
const router = express.Router();
const UserPromoCodeController = require('../controllers/userPromoCodeControllers');
const AuthController = require('../controllers/authControllers');

// router.post('/', AuthController.verifyToken, AuthController.requireAdmin, (req, res) => {UserPromoCodeController.createUserPromoCode(req, res);});
// router.get('/', AuthController.verifyToken, AuthController.requireAdmin, (req, res) => {UserPromoCodeController.getAllUserPromoCodes(req, res);});
// router.get('/:id', AuthController.verifyToken, AuthController.requireAdmin, (req, res) => {UserPromoCodeController.getUserPromoCodeById(req, res);});
// router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, (req, res) => {UserPromoCodeController.updateUserPromoCode(req, res);});
// router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, (req, res) => {UserPromoCodeController.deleteUserPromoCode(req, res);});

module.exports = router;