const PromoCodeServices = require('../services/promoCodeServices');
const UserPromoCodeServices = require('../services/userPromoCodeServices');

async function getAllPromoCodes(req, res, next) {
    try {
        const promoCodes = await PromoCodeServices.getAllPromoCodes();
        res.status(200).json(promoCodes);
    } catch (error) {
        return next(error);
    }
}

async function createPromoCode(req, res, next) {
    try {
        const promoCode = await PromoCodeServices.createPromoCode(req.body);
        res.status(201).json(promoCode);
    } catch (error) {
        return next(error);
    }
}

async function getPromoCodeById(req, res, next) {
    try {
        const promoCode = await PromoCodeServices.getPromoCodeById(req.params.id);
        if (!promoCode) {
            return res.status(404).json({ "message": "Code promo non trouvé" });
        }
        res.status(200).json(promoCode);
    } catch (error) {
        return next(error);
    }
}

async function checkPromoCodeValidity(req, res, next) {
    try {
        // const result = await UserPromoCodeServices.checkPromoCodeUsed(req.params.code, req.user.id);
        // if (result.length > 0) {
        //     return res.status(200).json({ "valid": false, "message": "Code promo déjà utilisé" });
        // }
        const isValid = await PromoCodeServices.checkPromoCodeIsValid(req.params.code);
        if (!isValid) {
            return res.status(200).json({ "valid": false, "message": "Code promo invalide ou expiré" });
        }
        return res.status(200).json({ "valid": isValid, "message": "Code promo valide" });
    } catch (error) {
        return next(error);
    }
}

async function updatePromoCode(req, res, next) {
    try {
        const promoCode = await PromoCodeServices.updatePromoCode(req.params.id, req.body);
        if (!promoCode) {
            return res.status(404).json({ "message": "Code promo non trouvé" });
        }
        res.status(200).json(promoCode);
    } catch (error) {
        return next(error);
    }
}

async function deletePromoCode(req, res, next) {
    try {
        const result = await PromoCodeServices.deletePromoCode(req.params.id);
        if (!result) {
            return res.status(404).json({ "message": "Code promo non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

async function getPromoCodeByCode(req, res, next) {
    try {
        const promoCode = await PromoCodeServices.getPromoCodeByCode(req.params.code);
        if (!promoCode) {
            return res.status(404).json({ "message": "Code promo non trouvé" });
        }
        res.status(200).json(promoCode);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllPromoCodes,
    createPromoCode,
    getPromoCodeById,
    updatePromoCode,
    deletePromoCode,
    getPromoCodeByCode,
    checkPromoCodeValidity
};