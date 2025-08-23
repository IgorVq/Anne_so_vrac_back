// controllers/discountsControllers.js
const DiscountsServices = require('../services/discountsServices');

async function createDiscount(req, res, next) {
  try {
    const discount = await DiscountsServices.createDiscount(req.body);
    return res.status(201).json(discount);
  } catch (error) {
    return next(error);
  }
}

async function getAllDiscounts(_req, res, next) {
  try {
    const discounts = await DiscountsServices.getAllDiscounts();
    return res.status(200).json(discounts);
  } catch (error) {
    return next(error);
  }
}

async function getDiscountById(req, res, next) {
  try {
    const discount = await DiscountsServices.getDiscountById(req.params.id);
    if (!discount) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réduction non trouvée' });
    }
    return res.status(200).json(discount);
  } catch (error) {
    return next(error);
  }
}

async function getDiscountsByProduct(req, res, next) {
  try {
    const discounts = await DiscountsServices.getDiscountsByProduct(req.params.productId);
    return res.status(200).json(discounts);
  } catch (error) {
    return next(error);
  }
}

async function updateDiscount(req, res, next) {
  try {
    const discount = await DiscountsServices.updateDiscount(req.params.id, req.body);
    if (!discount) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réduction non trouvée' });
    }
    return res.status(200).json(discount);
  } catch (error) {
    return next(error);
  }
}

async function deleteDiscount(req, res, next) {
  try {
    const result = await DiscountsServices.deleteDiscount(req.params.id);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réduction non trouvée' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  getDiscountsByProduct,
  updateDiscount,
  deleteDiscount,
};
