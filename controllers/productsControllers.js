const ProductsServices = require('../services/productsServices');

async function createProduct(req, res, next) {
    try {
        const product = await ProductsServices.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        return next(error);
    }
}

async function getAllProducts(req, res, next) {
    try {
        const products = await ProductsServices.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
}

async function getAvailableProductsId(req, res, next) {
    try {
        const products = await ProductsServices.getAvailableProductsId();
        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
}

async function getAvailableProductsByCategoryId(req, res, next) {
    try {
        const products = await ProductsServices.getAvailableProductsByCategoryId(req.params.categoryId);
        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
}

async function getAvailablePromoProductsId(req, res, next) {
    try {
        const products = await ProductsServices.getAvailablePromoProductsId();
        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
}

async function getAvailableLocalProductsId(req, res, next) {
    try {
        const products = await ProductsServices.getAvailableLocalProductsId();
        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
}

async function getProductCardInfoById(req, res, next) {
    try {
        const product = await ProductsServices.getProductCardInfoById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json(product);
    } catch (error) {
        return next(error);
    }
}

async function getProductById(req, res, next) {
    try {
        const product = await ProductsServices.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json(product);
    } catch (error) {
        return next(error);
    }
}

async function updateProduct(req, res, next) {
    try {
        const product = await ProductsServices.updateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json(product);
    } catch (error) {
        return next(error);
    }
}

async function deleteProduct(req, res, next) {
    try {
        const result = await ProductsServices.deleteProduct(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

// ===== NOUVEAUX CONTRÔLEURS ADMIN =====

async function getAllProductsForAdmin(req, res, next) {
    try {
        const products = await ProductsServices.getAllProductsForAdmin();
        res.status(200).json({ data: products });
    } catch (error) {
        return next(error);
    }
}

async function getProductForAdmin(req, res, next) {
    try {
        const product = await ProductsServices.getProductForAdmin(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ data: product });
    } catch (error) {
        return next(error);
    }
}

async function createProductAdmin(req, res, next) {
    try {
        const product = await ProductsServices.createProductAdmin(req.body);
        res.status(201).json({ data: product });
    } catch (error) {
        return next(error);
    }
}

async function updateProductAdmin(req, res, next) {
    try {
        const product = await ProductsServices.updateProductAdmin(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ data: product });
    } catch (error) {
        return next(error);
    }
}

async function deleteProductAdmin(req, res, next) {
    try {
        const success = await ProductsServices.deleteProductAdmin(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAvailableProductsId,
    getProductCardInfoById,
    getAvailablePromoProductsId,
    getAvailableLocalProductsId,
    getAvailableProductsByCategoryId,
    // Nouveaux contrôleurs admin
    getAllProductsForAdmin,
    getProductForAdmin,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin
};