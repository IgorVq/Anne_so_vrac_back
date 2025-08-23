// controllers/rolesControllers.js
const RolesServices = require('../services/rolesServices');

async function createRole(req, res, next) {
  try {
    const role = await RolesServices.createRole(req.body);
    return res.status(201).json(role);
  } catch (error) {
    return next(error);
  }
}

async function getAllRoles(_req, res, next) {
  try {
    const roles = await RolesServices.getAllRoles();
    return res.status(200).json(roles);
  } catch (error) {
    return next(error);
  }
}

async function getRoleById(req, res, next) {
  try {
    const role = await RolesServices.getRoleById(req.params.id);
    if (!role) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Rôle non trouvé' });
    }
    return res.status(200).json(role);
  } catch (error) {
    return next(error);
  }
}

async function updateRole(req, res, next) {
  try {
    const role = await RolesServices.updateRole(req.params.id, req.body);
    if (!role) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Rôle non trouvé' });
    }
    return res.status(200).json(role);
  } catch (error) {
    return next(error);
  }
}

async function deleteRole(req, res, next) {
  try {
    const result = await RolesServices.deleteRole(req.params.id);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Rôle non trouvé' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
