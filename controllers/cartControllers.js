const CartServices = require('../services/cartServices');

async function getAllCarts(req, res, next) {
    try {
        const carts = await CartServices.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        return next(error);
    }
}

async function createCart(req, res, next) {
    try {
        const cart = await CartServices.createCart(req.body);
        res.status(201).json(cart);
    } catch (error) {
        return next(error);
    }
}

async function createMyCart(req, res, next) {
    try {
        req.body.id_user = req.user.id;
        const cart = await CartServices.createCart(req.body);
        res.status(201).json(cart);
    } catch (error) {
        return next(error);
    }
}   

async function getCartById(req, res, next) {
    try {
        const cart = await CartServices.getCartById(req.params.id);
        if (!cart) {
            return res.status(404).json({ "message": "Panier non trouvé" });
        }
        res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
}

async function getMyCartById(req, res, next) {
    try {
        const cart = await CartServices.getMyCartById(req.params.id, req.user.id);
        if (!cart) {
            return res.status(404).json({ "message": "Panier non trouvé" });
        }
        res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
}

async function getCartInfoByCartId(req, res, next) {
    try {
        const cartInfo = await CartServices.getCartInfoByCartId(req.params.id);
        if (!cartInfo || cartInfo.length === 0) {
            return res.status(404).json({ "message": "Aucune information de panier trouvée pour cet ID" });
        }
        res.status(200).json(cartInfo);
    } catch (error) {
        return next(error);
    }
}

async function getCartByUserId(req, res, next) {
    try {
        const cart = await CartServices.getCartByUserId(req.params.userId);
        if (!cart) {
            return res.status(404).json({ "message": "Panier non trouvé pour cet utilisateur" });
        }
        res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
}
    
async function getMyCart(req, res, next) {
    try {
        const cart = await CartServices.getCartByUserId(req.user.id);
        if (!cart) {
            return res.status(404).json({ "message": "Panier non trouvé pour cet utilisateur" });
        }
        res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
}

async function updateCart(req, res, next) {
    try {
        const cart = await CartServices.updateCart(req.params.id, req.body);
        if (!cart) {
            return res.status(404).json({ "message": "Panier non trouvé" });
        }
        res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
}

async function updateMyCart(req, res, next) {
    try {
        const cart = await CartServices.updateMyCart(req.params.id, req.user.id, req.body);
        if (!cart) {
            return res.status(404).json({ "message": "Panier non trouvé" });
        }
        res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
}

async function deleteCart(req, res, next) {
    try {
        const result = await CartServices.deleteCart(req.params.id);
        if (!result) {
            return res.status(404).json({ "message": "Panier non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

async function deleteMyCart(req, res, next) {
    try {
        const result = await CartServices.deleteMyCart(req.params.id, req.user.id);
        if (!result) {
            return res.status(404).json({ "message": "Panier non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}



module.exports = {
    getAllCarts,
    createCart,
    getCartById,
    updateCart,
    updateMyCart,
    deleteCart,
    deleteMyCart,
    getCartByUserId,
    getMyCart,
    getCartInfoByCartId,
    createMyCart,
    getMyCartById,
};