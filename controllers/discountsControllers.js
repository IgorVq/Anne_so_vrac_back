const DiscountsServices = require('../services/discountsServices');

async function createDiscount(req, res, next) {
    try {
        const discount = await DiscountsServices.createDiscount(req.body);
        res.status(201).json(discount);
    } catch (error) {
        return next(error);
    }
}

async function getAllDiscounts(req, res, next) {
    try {
        const discounts = await DiscountsServices.getAllDiscounts();
        res.status(200).json(discounts);
    } catch (error) {
        return next(error);
    }
}

async function getDiscountById(req, res, next) {
    try {
        const discount = await DiscountsServices.getDiscountById(req.params.id);
        if (!discount) {
            return res.status(404).json({ message: "Réduction non trouvée" });
        }
        res.status(200).json(discount);
    } catch (error) {
        return next(error);
    }
}

async function getDiscountsByProduct(req, res, next) {
    try {
        const discounts = await DiscountsServices.getDiscountsByProduct(req.params.productId);
        res.status(200).json(discounts);
    } catch (error) {
        return next(error);
    }
}

async function updateDiscount(req, res, next) {
    try {
        const discount = await DiscountsServices.updateDiscount(req.params.id, req.body);
        if (!discount) {
            return res.status(404).json({ message: "Réduction non trouvée" });
        }
        res.status(200).json(discount);
    } catch (error) {
        return next(error);
    }
}

async function deleteDiscount(req, res, next) {
    try {
        const result = await DiscountsServices.deleteDiscount(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Réduction non trouvée" });
        }
        res.status(204).send();
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