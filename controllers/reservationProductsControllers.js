// controllers/reservationProductsControllers.js
const ReservationProductsServices = require('../services/reservationProductsServices');

async function createReservationProduct(req, res, next) {
  try {
    const reservationProduct = await ReservationProductsServices.createReservationProduct(req.body);
    return res.status(201).json(reservationProduct);
  } catch (error) {
    return next(error);
  }
}

async function getAllReservationProducts(_req, res, next) {
  try {
    const reservationProducts = await ReservationProductsServices.getAllReservationProducts();
    return res.status(200).json(reservationProducts);
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
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation de produit non trouvée' });
    }
    return res.status(200).json(reservationProduct);
  } catch (error) {
    return next(error);
  }
}

async function getAllReservationProductsByReservationId(req, res, next) {
  try {
    const { id_reservation } = req.params;
    const reservationProducts = await ReservationProductsServices.getAllReservationProductsByReservationId(id_reservation);
    if (!reservationProducts || reservationProducts.length === 0) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Aucun produit trouvé pour cette réservation' });
    }
    return res.status(200).json(reservationProducts);
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
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation de produit non trouvée' });
    }
    return res.status(200).json(reservationProduct);
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
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation de produit non trouvée' });
    }
    return res.status(204).send();
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
  deleteReservationProduct,
};
