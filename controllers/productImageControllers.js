const ProductsImageServices = require('../services/productImageServices');

async function createProductImage(req, res, next) {
    try {
        if (!req.body.id_product || !req.body.id_image) {
            return res.status(400).json({ message: "id_product et id_image sont requis" });
        }
        const productImage = await ProductsImageServices.createProductImage(req.body);
        res.status(201).json(productImage);
    } catch (error) {
        return next(error);
    }
}

async function getAllProductImages(req, res, next) {
    try {
        const productImages = await ProductsImageServices.getAllProductImages();
        res.status(200).json(productImages);
    } catch (error) {
        return next(error);
    }
}

async function getProductImagesByProductId(req, res, next) {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "ID du produit requis" });
        }
        const productImages = await ProductsImageServices.getProductImageById(req.params.id);
        if (!productImages || productImages.length === 0) {
            return res.status(404).json({ message: "Aucune image trouvée pour ce produit" });
        }
        res.status(200).json(productImages);
    } catch (error) {
        return next(error);
    }
}

async function deleteProductImage(req, res, next) {
    try {
        if (!req.params.productId || !req.params.imageId) {
            return res.status(400).json({ message: "ID du produit et ID de l'image requis" });
        }
        const result = await ProductsImageServices.deleteProductImage(req.params.productId, req.params.imageId);
        if (!result) {
            return res.status(404).json({ message: "Association produit-image non trouvée" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createProductImage,
    getAllProductImages,
    getProductImagesByProductId,
    deleteProductImage,
};