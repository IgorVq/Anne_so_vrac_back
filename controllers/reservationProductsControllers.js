const ReservationProductsServices = require('../services/reservationProductsServices');

async function createReservationProduct(req, res) {
    try {
        const reservationProduct = await ReservationProductsServices.createReservationProduct(req.body);
        res.status(201).json(reservationProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllReservationProducts(req, res) {
    try {
        const reservationProducts = await ReservationProductsServices.getAllReservationProducts();
        res.status(200).json(reservationProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getReservationProductById(req, res) {
    try {
        const { id_reservation, id_product, id_product_size } = req.params;
        const reservationProduct = await ReservationProductsServices.getReservationProductById(
            id_reservation,
            id_product,
            id_product_size
        );
        if (!reservationProduct) {
            return res.status(404).json({ message: "Réservation de produit non trouvée" });
        }
        res.status(200).json(reservationProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllReservationProductsByReservationId(req, res) {
    try {
        const { id_reservation } = req.params;
        const reservationProducts = await ReservationProductsServices.getAllReservationProductsByReservationId(id_reservation);
        if (!reservationProducts || reservationProducts.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cette réservation" });
        }
        res.status(200).json(reservationProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateReservationProduct(req, res) {
    try {
        const { id_reservation, id_product, id_product_size } = req.params;
        const reservationProduct = await ReservationProductsServices.updateReservationProduct(
            id_reservation,
            id_product,
            id_product_size,
            req.body
        );
        if (!reservationProduct) {
            return res.status(404).json({ message: "Réservation de produit non trouvée" });
        }
        res.status(200).json(reservationProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteReservationProduct(req, res) {
    try {
        const { id_reservation, id_product, id_product_size } = req.params;
        const result = await ReservationProductsServices.deleteReservationProduct(
            id_reservation,
            id_product,
            id_product_size
        );
        if (!result) {
            return res.status(404).json({ message: "Réservation de produit non trouvée" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createReservationProduct,
    getAllReservationProducts,
    getReservationProductById,
    updateReservationProduct,
    deleteReservationProduct,
    getAllReservationProductsByReservationId
};