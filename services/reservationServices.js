const { p } = require('../config/bdd');
require('dotenv').config();

async function getAllReservations() {
    const results = await p.query('SELECT * FROM reservation');
    return results[0];
}

async function createReservation(reservation) {
    const [result] = await p.query('INSERT INTO reservation SET ?', [reservation]);
    const [newReservation] = await p.query('SELECT * FROM reservation WHERE id_reservation = ?', [result.insertId]);
    return newReservation[0];
}

async function getReservationById(id) {
    const [results] = await p.query('SELECT * FROM reservation WHERE id_reservation = ?', [id]);
    return results[0];
}

async function updateReservation(id, reservation) {
    const [existingReservation] = await p.query('SELECT * FROM reservation WHERE id_reservation = ?', [id]);
    if (!existingReservation[0]) {
        return null;
    }
    await p.query('UPDATE reservation SET ? WHERE id_reservation = ?', [reservation, id]);
    const [updatedReservation] = await p.query('SELECT * FROM reservation WHERE id_reservation = ?', [id]);
    return updatedReservation[0];
}

async function deleteReservation(id) {
    const [existingReservation] = await p.query('SELECT * FROM reservation WHERE id_reservation = ?', [id]);
    if (!existingReservation[0]) {
        return null;
    }
    await p.query('DELETE FROM reservation WHERE id_reservation = ?', [id]);
    return true;
}

async function deletePendingReservationByUserId(userId) {
    await p.query(
        'DELETE rp FROM reservation_products rp INNER JOIN reservation r ON rp.id_reservation = r.id_reservation WHERE r.id_user = ? AND r.status = "pending"', 
        [userId]
    );
    await p.query('DELETE FROM reservation WHERE id_user = ? AND status = "pending"', [userId]);
    return { message: 'Réservations et produits associés supprimés avec succès' };
}

async function createPaymentIntent(amount) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'eur',
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return paymentIntent.client_secret;
}

async function getAllReservationsByState(state) {
    const [results] = await p.query('SELECT * FROM reservation WHERE status = ?', [state]);
    return results;
}

async function getMyReservationById(id, userId) {
    const [results] = await p.query('SELECT * FROM reservation WHERE id_reservation = ? AND id_user = ?', [id, userId]);
    return results[0];
}

async function getMyReservations(userId) {
    const [results] = await p.query('SELECT * FROM reservation WHERE id_user = ? ORDER BY id_reservation DESC', [userId]);
    return results;
}

async function getMyLastReservation(userId) {
    const [results] = await p.query('SELECT * FROM reservation WHERE id_user = ? AND status != "pending" AND status != "withdrawn" ORDER BY id_reservation DESC LIMIT 1', [userId]);
    return results[0];
}

module.exports = {
    getAllReservations,
    createReservation,
    getReservationById,
    getMyReservationById,
    updateReservation,
    deleteReservation,
    createPaymentIntent,
    deletePendingReservationByUserId,
    getMyReservations,
    getMyLastReservation,
    getAllReservationsByState
};