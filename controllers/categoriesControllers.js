const CategoriesServices = require('../services/categoriesServices');

async function createCategory(req, res, next) {
    try {
        const category = await CategoriesServices.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        return next(error);
    }
}

async function getAllCategories(req, res, next) {
    try {
        const categories = await CategoriesServices.getAllCategories();
        res.status(200).json(categories);
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

async function getCategoryById(req, res, next) {
    try {
        const category = await CategoriesServices.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json(category);
    } catch (error) {
        return next(error);
    }
}

async function updateCategory(req, res, next) {
    try {
        const category = await CategoriesServices.updateCategory(req.params.id, req.body);
        if (!category) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(200).json(category);
    } catch (error) {
        return next(error);
    }
}

async function deleteCategory(req, res, next) {
    try {
        const result = await CategoriesServices.deleteCategory(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getAvailableCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};