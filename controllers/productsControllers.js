// controllers/productsControllers.js
const ProductsServices = require('../services/productsServices');

// ===== PUBLIC =====
async function createProduct(req, res, next) {
  try {
    const product = await ProductsServices.createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

async function getAllProducts(_req, res, next) {
  try {
    const products = await ProductsServices.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await ProductsServices.getProductById(req.params.id);
    if (!product) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Produit non trouvé' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const updated = await ProductsServices.updateProduct(req.params.id, req.body);
    if (!updated) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Produit non trouvé' });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const ok = await ProductsServices.deleteProduct(req.params.id);
    if (!ok) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Produit non trouvé' });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

// ===== Cartes / filtres =====
async function getAvailableProductsId(_req, res, next) {
  try {
    const data = await ProductsServices.getAvailableProductsId();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function getAvailablePromoProductsId(_req, res, next) {
  try {
    const data = await ProductsServices.getAvailablePromoProductsId();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function getAvailableLocalProductsId(_req, res, next) {
  try {
    const data = await ProductsServices.getAvailableLocalProductsId();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function getAvailableProductsByCategoryId(req, res, next) {
  try {
    const data = await ProductsServices.getAvailableProductsByCategoryId(req.params.categoryId);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function getProductCardInfoById(req, res, next) {
  try {
    const card = await ProductsServices.getProductCardInfoById(req.params.id);
    if (!card) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Produit non trouvé' });
    }
    return res.status(200).json(card);
  } catch (error) {
    return next(error);
  }
}

// ===== ADMIN =====
async function getAllProductsForAdmin(_req, res, next) {
  try {
    const data = await ProductsServices.getAllProductsForAdmin();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function getProductForAdmin(req, res, next) {
  try {
    const data = await ProductsServices.getProductForAdmin(req.params.id);
    if (!data) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Produit non trouvé' });
    }
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function createProductAdmin(req, res, next) {
  try {
    const data = await ProductsServices.createProductAdmin(req.body);
    return res.status(201).json({ data });
  } catch (error) {
    return next(error);
  }
}

async function updateProductAdmin(req, res, next) {
  try {
    const data = await ProductsServices.updateProductAdmin(req.params.id, req.body);
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
}

async function deleteProductAdmin(req, res, next) {
  try {
    const ok = await ProductsServices.deleteProductAdmin(req.params.id);
    if (!ok) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Produit non trouvé' });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  // public
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAvailableProductsId,
  getAvailablePromoProductsId,
  getAvailableLocalProductsId,
  getAvailableProductsByCategoryId,
  getProductCardInfoById,
  // admin
  getAllProductsForAdmin,
  getProductForAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
};
