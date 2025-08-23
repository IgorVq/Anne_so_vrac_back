const { p } = require('../config/bdd');

async function getAllCredentials() {
    const results = await p.query('SELECT * FROM Credentials');
    return results[0];
}

async function createCredential(credential) {
    try {
        // Vérifier les champs requis
        if (!credential.password || !credential.email || !credential.phone) {
            throw new Error('Les champs password, email et phone sont requis');
        }

        const results = await p.query('INSERT INTO Credentials SET ?', [credential]);
        return getCredentialById(results[0].insertId);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('email')) {
                throw new Error('Cet email est déjà utilisé');
            }
            if (error.message.includes('phone')) {
                throw new Error('Ce numéro de téléphone est déjà utilisé');
            }
        }
        throw error;
    }
}

async function getCredentialById(id) {
    const results = await p.query('SELECT * FROM Credentials WHERE id_credential = ?', [id]);
    return results[0][0];
}

async function updateCredential(id, credential) {
    try {
        await p.query('UPDATE Credentials SET ? WHERE id_credential = ?', [credential, id]);
        return getCredentialById(id);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('email')) {
                throw new Error('Cet email est déjà utilisé');
            }
            if (error.message.includes('phone')) {
                throw new Error('Ce numéro de téléphone est déjà utilisé');
            }
        }
        throw error;
    }
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