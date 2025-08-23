const RolesServices = require('../services/rolesServices');

async function createRole(req, res) {
  try {
    const role = await RolesServices.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllRoles(req, res) {
  try {
    const roles = await RolesServices.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getRoleById(req, res) {
  try {
    const role = await RolesServices.getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateRole(req, res) {
  try {
    const role = await RolesServices.updateRole(req.params.id, req.body);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteRole(req, res) {
  try {
    const result = await RolesServices.deleteRole(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole
};