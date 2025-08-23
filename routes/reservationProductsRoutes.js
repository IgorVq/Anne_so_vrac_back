const express = require('express');
const router = express.Router();
const ReservationProductsController = require('../controllers/reservationProductsControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, ReservationProductsController.createReservationProduct);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, ReservationProductsController.getAllReservationProducts);
router.get('/reservation/:id_reservation', AuthController.verifyToken, ReservationProductsController.getAllReservationProductsByReservationId);
router.get('/:id_reservation/:id_product/:id_product_size', AuthController.verifyToken, AuthController.requireAdmin, ReservationProductsController.getReservationProductById);
router.patch('/:id_reservation/:id_product/:id_product_size', AuthController.verifyToken, AuthController.requireAdmin, ReservationProductsController.updateReservationProduct);
router.delete('/:id_reservation/:id_product/:id_product_size', AuthController.verifyToken, AuthController.requireAdmin, ReservationProductsController.deleteReservationProduct);

module.exports = router;