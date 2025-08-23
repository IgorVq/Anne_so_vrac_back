// controllers/promoCodeControllers.js
const PromoCodeServices = require('../services/promoCodeServices');

async function getAllPromoCodes(_req, res, next) {
  try {
    const codes = await PromoCodeServices.getAllPromoCodes();
    return res.status(200).json(codes);
  } catch (error) {
    return next(error);
  }
}

async function createPromoCode(req, res, next) {
  try {
    const { code, discount_percent, valid_from, valid_to, is_active } = req.body;
    if (!code || discount_percent == null || !valid_from || !valid_to || is_active == null) {
      return next({ status: 400, code: 'VALIDATION', message: 'Champs requis manquants' });
    }
    const created = await PromoCodeServices.createPromoCode(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return next(error); // 1062 -> DUPLICATE (mapper)
  }
}

async function getPromoCodeById(req, res, next) {
  try {
    const code = await PromoCodeServices.getPromoCodeById(req.params.id);
    if (!code) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Code promo non trouvé' });
    }
    return res.status(200).json(code);
  } catch (error) {
    return next(error);
  }
}

async function updatePromoCode(req, res, next) {
  try {
    const updated = await PromoCodeServices.updatePromoCode(req.params.id, req.body);
    if (!updated) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Code promo non trouvé' });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deletePromoCode(req, res, next) {
  try {
    const ok = await PromoCodeServices.deletePromoCode(req.params.id);
    if (!ok) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Code promo non trouvé' });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function checkPromoCodeValidity(req, res, next) {
    try {
        const isValid = await PromoCodeServices.checkPromoCodeIsValid(req.params.code);
        if (!isValid) {
            return next({ status: 200, code: 'INVALID', message: 'Code promo invalide ou expiré' });
        }
        return res.status(200).json({ "valid": isValid, "message": "Code promo valide" });
    } catch (error) {
        return next(error);
    }
}

async function getPromoCodeByCode(req, res, next) {
    try {
        const promoCode = await PromoCodeServices.getPromoCodeByCode(req.params.code);
        if (!promoCode) {
            return next({ status: 404, code: 'NOT_FOUND', message: 'Code promo non trouvé' });
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
  getPromoCodeByCode,
  updatePromoCode,
  deletePromoCode,
  checkPromoCodeValidity,
};
