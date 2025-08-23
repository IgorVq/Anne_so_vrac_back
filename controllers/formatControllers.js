const FormatServices = require('../services/formatServices');

async function createFormat(req, res, next) {
    try {
        const format = await FormatServices.createFormat(req.body);
        res.status(201).json(format);
    } catch (error) {
        return next(error);
    }
}

async function getAllFormats(req, res, next) {
    try {
        const formats = await FormatServices.getAllFormats();
        res.status(200).json(formats);
    } catch (error) {
        return next(error);
    }
}

async function getFormatById(req, res, next) {
    try {
        const format = await FormatServices.getFormatById(req.params.id);
        if (!format) {
            return res.status(404).json({ message: "Format non trouvé" });
        }
        res.status(200).json(format);
    } catch (error) {
        return next(error);
    }
}

async function getProductSizeByProductId(req, res, next) {
    try {
        const productSizes = await FormatServices.getProductSizeByProductId(req.params.id);
        if (!productSizes || productSizes.length === 0) {
            return res.status(404).json({ message: "Aucune taille de produit trouvée pour ce produit" });
        }
        res.status(200).json(productSizes);
    } catch (error) {
        return next(error);
    }
}

async function updateFormat(req, res, next) {
    try {
        const format = await FormatServices.updateFormat(req.params.id, req.body);
        if (!format) {
            return res.status(404).json({ message: "Format non trouvé" });
        }
        res.status(200).json(format);
    } catch (error) {
        return next(error);
    }
}

async function getFormatByProductId(req, res, next) {
    try {
        const formats = await FormatServices.getFormatByProductId(req.params.id);
        res.status(200).json(formats);
    } catch (error) {
        return next(error);
    }
}

async function getFormatByProductSizeId(req, res, next) {
    try {
        const formats = await FormatServices.getFormatByProductSizeId(req.params.id);
        res.status(200).json(formats);
    } catch (error) {
        return next(error);
    }
}

async function deleteFormat(req, res, next) {
    try {
        const result = await FormatServices.deleteFormat(req.params.productId, req.params.productSizeId);
        if (!result) {
            return res.status(404).json({ message: "Format non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createFormat,
    getAllFormats,
    getFormatById,
    updateFormat,
    getFormatByProductId,
    getFormatByProductSizeId,
    deleteFormat,
    getProductSizeByProductId
};