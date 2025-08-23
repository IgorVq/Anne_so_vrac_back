const ReservationProductsServices = require('../services/reservationProductsServices');

async function createReservationProduct(req, res, next) {
    try {
        const reservationProduct = await ReservationProductsServices.createReservationProduct(req.body);
        res.status(201).json(reservationProduct);
    } catch (error) {
        return next(error);
    }
}

async function getAllReservationProducts(req, res, next) {
    try {
        const reservationProducts = await ReservationProductsServices.getAllReservationProducts();
        res.status(200).json(reservationProducts);
    } catch (error) {
        return next(error);
    }
}

async function getReservationProductById(req, res, next) {
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
        return next(error);
    }
}

async function getAllReservationProductsByReservationId(req, res, next) {
    try {
        const { id_reservation } = req.params;
        const reservationProducts = await ReservationProductsServices.getAllReservationProductsByReservationId(id_reservation);
        if (!reservationProducts || reservationProducts.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cette réservation" });
        }
        res.status(200).json(reservationProducts);
    } catch (error) {
        return next(error);
    }
}

async function updateReservationProduct(req, res, next) {
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
        return next(error);
    }
}

async function deleteReservationProduct(req, res, next) {
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
        return next(error);
    }
}

module.exports = {
    createReservationProduct,
    getAllReservationProducts,
    getReservationProductById,
    getAllReservationProductsByReservationId,
    updateReservationProduct,
    deleteReservationProduct
};