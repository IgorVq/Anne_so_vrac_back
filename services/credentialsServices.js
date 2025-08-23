const { p } = require('../config/bdd');

async function getAllCredentials() {
    const results = await p.query('SELECT * FROM Credentials');
    return results[0];
}

async function createCredential(credential) {
    const results = await p.query('INSERT INTO Credentials SET ?', [credential]);
    return getCredentialById(results[0].insertId);
}

async function getCredentialById(id) {
    const results = await p.query('SELECT * FROM Credentials WHERE id_credential = ?', [id]);
    return results[0][0];
}

async function updateCredential(id, credential) {
    await p.query('UPDATE Credentials SET ? WHERE id_credential = ?', [credential, id]);
    return getCredentialById(id);
}

async function deleteCredential(id) {
    await p.query('DELETE FROM Credentials WHERE id_credential = ?', [id]);
    return { message: 'Credential deleted successfully' };
}

module.exports = {
    getAllCredentials,
    createCredential,
    getCredentialById,
    updateCredential,
    deleteCredential
};