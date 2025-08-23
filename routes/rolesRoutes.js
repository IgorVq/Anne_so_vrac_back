const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/rolesControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, RolesController.createRole);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, RolesController.getAllRoles);
router.get('/:id', AuthController.verifyToken, AuthController.requireAdmin, RolesController.getRoleById);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, RolesController.updateRole);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, RolesController.deleteRole);

module.exports = router;