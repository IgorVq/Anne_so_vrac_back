const express = require('express'); 
const router = express.Router();
const UsersControllers = require('../controllers/usersControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, UsersControllers.createUser);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, UsersControllers.getAllUsers);
router.post('/contact', UsersControllers.contactMail);
router.get('/me', AuthController.verifyToken, UsersControllers.getMe);
router.patch('/me', AuthController.verifyToken, UsersControllers.updateMe);
router.get('/:id', AuthController.verifyToken, AuthController.requireAdmin, UsersControllers.getUserById);
router.get('/email/:email', AuthController.verifyToken, AuthController.requireAdmin, UsersControllers.getUserByEmail);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, UsersControllers.updateUser);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, UsersControllers.deleteUser);


module.exports = router;