const { p } = require('../config/bdd');

async function getAllUsers() {
    const results = await p.query('select * from users');
    return results[0];
}

async function createUser(user) {
    const results = await p.query('insert into users set ?', [user]);
    return getUserById(results[0].insertId);
}

async function getUserById(id) {
    const results = await p.query('select users.*, credentials.phone, credentials.email from users inner join credentials on users.id_credential = credentials.id_credential where id_user = ?', [id]);
    return results[0][0];
}

async function getUserInfoById(id) {
    const results = await p.query(`
        SELECT 
            users.id_user,
            users.first_name,
            users.last_name,
            credentials.email,
            credentials.phone
        FROM users 
        INNER JOIN credentials ON users.id_credential = credentials.id_credential 
        INNER JOIN roles ON roles.id_role = users.id_role 
        WHERE users.id_user = ?
    `, [id]);
    return results[0][0];
}

async function updateUserInfoById(id, user) {
    const results = await p.query(`
        UPDATE users 
        INNER JOIN credentials ON users.id_credential = credentials.id_credential
        SET 
            users.first_name = ?,
            users.last_name = ?,
            credentials.phone = ?,
            credentials.email = ?
        WHERE users.id_user = ?
    `, [user.first_name, user.last_name, user.phone, user.email, id]);
    
    if (results[0].affectedRows > 0) {
        return getUserInfoById(id);
    } else {
        throw new Error('User not found or no changes made');
    }
}

async function getUserByEmail(email) {
    const results = await p.query(`
        SELECT 
            users.id_user,
            users.first_name,
            users.last_name,
            credentials.email,
            credentials.password,
            roles.admin
        FROM users 
        INNER JOIN credentials ON users.id_credential = credentials.id_credential 
        INNER JOIN roles ON roles.id_role = users.id_role 
        WHERE credentials.email = ?
    `, [email]);
    return results[0][0];
}

async function getUserByPhone(phone) {
    const results = await p.query(`
        SELECT 
            users.id_user,
            users.first_name,
            users.last_name,
            credentials.email,
            credentials.password,
            roles.admin
        FROM users 
        INNER JOIN credentials ON users.id_credential = credentials.id_credential 
        INNER JOIN roles ON roles.id_role = users.id_role 
        WHERE credentials.phone = ?
    `, [phone]);
    return results[0][0];
}

async function updateUser(id, user) {
    const results = await p.query('update users set ? where id_user = ?', [user, id]);
    return getUserById(id);
}

async function updateUserPassword(id, password) {
    const id_credential = await p.query('select id_credential from users where id_user = ?', [id]);
    const results = await p.query('update credentials set password = ? where id_credential = ?', [password.password, id_credential[0][0].id_credential]);
    return results[0].affectedRows > 0;
}

async function deleteUser(id) {
    await p.query('delete from users where id_user = ?', [id]);
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    updateUserPassword,
    getUserByPhone,
    getUserInfoById,
    updateUserInfoById
}