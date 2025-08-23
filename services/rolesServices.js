const { p } = require('../config/bdd');

async function getAllRoles() {
    const results = await p.query('SELECT * FROM roles');
    return results[0];
}

async function createRole(role) {
    const results = await p.query('INSERT INTO roles SET ?', [role]);
    return getRoleById(results[0].insertId);
}

async function getRoleById(id) {
    const results = await p.query('SELECT * FROM roles WHERE id_role = ?', [id]);
    return results[0][0];
}

async function updateRole(id, role) {
    await p.query('UPDATE roles SET ? WHERE id_role = ?', [role, id]);
    return getRoleById(id);
}

async function deleteRole(id) {
    await p.query('DELETE FROM roles WHERE id_role = ?', [id]);
    return { message: 'Role deleted successfully' };
}

module.exports = {
    getAllRoles,
    createRole,
    getRoleById,
    updateRole,
    deleteRole
};