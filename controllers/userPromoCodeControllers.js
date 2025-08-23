const UserPromoCodeServices = require('../services/userPromoCodeServices');

async function getAllUserPromoCodes(req, res) {
    try {
        const userPromoCodes = await UserPromoCodeServices.getAllUserPromoCodes();
        res.status(200).json(userPromoCodes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la récupération des codes promo utilisateurs" });
    }
}

async function createUserPromoCode(req, res) {
    try {
        const userPromoCode = await UserPromoCodeServices.createUserPromoCode(req.body);
        res.status(201).json(userPromoCode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la création du code promo utilisateur" });
    }
}

async function getUserPromoCodeById(req, res) {
    try {
        const userPromoCode = await UserPromoCodeServices.getUserPromoCodeById(req.params.id);
        if (!userPromoCode) {
            return res.status(404).json({ "message": "Code promo utilisateur non trouvé" });
        }
        res.status(200).json(userPromoCode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la récupération du code promo utilisateur" });
    }
}

async function updateUserPromoCode(req, res) {
    try {
        const userPromoCode = await UserPromoCodeServices.updateUserPromoCode(req.params.id, req.body);
        if (!userPromoCode) {
            return res.status(404).json({ "message": "Code promo utilisateur non trouvé" });
        }
        res.status(200).json(userPromoCode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la mise à jour du code promo utilisateur" });
    }
}

async function deleteUserPromoCode(req, res) {
    try {
        const result = await UserPromoCodeServices.deleteUserPromoCode(req.params.id);
        if (!result) {
            return res.status(404).json({ "message": "Code promo utilisateur non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la suppression du code promo utilisateur" });
    }
}

module.exports = {
    getAllUserPromoCodes,
    createUserPromoCode,
    getUserPromoCodeById,
    updateUserPromoCode,
    deleteUserPromoCode
};