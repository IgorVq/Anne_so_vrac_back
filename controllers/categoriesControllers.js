const CategoriesServices = require('../services/categoriesServices');

async function getAllCategories(_req, res, next) {
  try {
    const data = await CategoriesServices.getAllCategories();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { category_name, visible } = req.body;
    if (!category_name || visible == null) {
      return next({ status: 400, code: 'VALIDATION', message: 'category_name et visible sont requis' });
    }
    const created = await CategoriesServices.createCategory(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const found = await CategoriesServices.getCategoryById(req.params.id);
    if (!found) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Catégorie non trouvée' });
    }
    return res.status(200).json(found);
  } catch (error) {
    return next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const updated = await CategoriesServices.updateCategory(req.params.id, req.body);
    if (!updated) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Catégorie non trouvée' });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await CategoriesServices.deleteCategory(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function getAvailableCategories(req, res, next) {
    try {
        const categories = await CategoriesServices.getAvailableCategories();
        res.status(200).json(categories);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  getAvailableCategories,
  updateCategory,
  deleteCategory,
};
