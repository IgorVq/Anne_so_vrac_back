const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationControllers');
const AuthController = require('../controllers/authControllers');

router.post('/', AuthController.verifyToken, AuthController.requireAdmin, ReservationController.createReservation);
router.post('/create', AuthController.verifyToken, ReservationController.createReservationIntent);
// router.post('/create-payment-intent', AuthController.verifyToken, ReservationController.createPaymentIntent);
router.post('/apply-promo-code', AuthController.verifyToken, ReservationController.applyPromoCode);
router.post('/confirm-payment', AuthController.verifyToken, ReservationController.confirmPayment);
router.get('/all/state/:state', ReservationController.getAllReservationsByState);
router.get('/me/last', AuthController.verifyToken, ReservationController.getMyLastReservation);
router.get('/me/:id', AuthController.verifyToken, ReservationController.getMyReservationById);
router.get('/me', AuthController.verifyToken, ReservationController.getMyReservations);
router.get('/:id', AuthController.verifyToken, AuthController.requireAdmin, ReservationController.getReservationById);
router.get('/', AuthController.verifyToken, AuthController.requireAdmin, ReservationController.getAllReservations);
router.patch('/:id', AuthController.verifyToken, AuthController.requireAdmin, ReservationController.updateReservation);
router.patch('/update-status/:id', AuthController.verifyToken, AuthController.requireAdmin, ReservationController.updateReservationStatus);
router.delete('/:id', AuthController.verifyToken, AuthController.requireAdmin, ReservationController.deleteReservation);
router.delete('/me/remove-past-reservation', AuthController.verifyToken, ReservationController.removeMyPastReservations);

module.exports = router;