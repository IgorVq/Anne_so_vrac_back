const UserPromoCodeServices = require('../services/userPromoCodeServices');

async function getAllUserPromoCodes(req, res, next) {
    try {
        const userPromoCodes = await UserPromoCodeServices.getAllUserPromoCodes();
        res.status(200).json(userPromoCodes);
    } catch (error) {
        return next(error);
    }
}

async function createUserPromoCode(req, res, next) {
    try {
        const userPromoCode = await UserPromoCodeServices.createUserPromoCode(req.body);
        res.status(201).json(userPromoCode);
    } catch (error) {
        return next(error);
    }
}

async function getUserPromoCodeById(req, res, next) {
    try {
        const userPromoCode = await UserPromoCodeServices.getUserPromoCodeById(req.params.id);
        if (!userPromoCode) {
            return res.status(404).json({ "message": "Code promo utilisateur non trouvé" });
        }
        res.status(200).json(userPromoCode);
    } catch (error) {
        return next(error);
    }
}

async function updateUserPromoCode(req, res, next) {
    try {
        const userPromoCode = await UserPromoCodeServices.updateUserPromoCode(req.params.id, req.body);
        if (!userPromoCode) {
            return res.status(404).json({ "message": "Code promo utilisateur non trouvé" });
        }
        res.status(200).json(userPromoCode);
    } catch (error) {
        return next(error);
    }
}

async function deleteUserPromoCode(req, res, next) {
    try {
        const result = await UserPromoCodeServices.deleteUserPromoCode(req.params.id);
        if (!result) {
            return res.status(404).json({ "message": "Code promo utilisateur non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllUserPromoCodes,
    createUserPromoCode,
    getUserPromoCodeById,
    updateUserPromoCode,
    deleteUserPromoCode
};