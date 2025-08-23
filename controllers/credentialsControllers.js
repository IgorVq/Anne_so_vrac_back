const CredentialsServices = require('../services/credentialsServices');

async function getAllCredentials(req, res, next) {
    try {
        const credentials = await CredentialsServices.getAllCredentials();
        res.status(200).json(credentials);
    } catch (error) {
        return next(error);
    }
}

async function createCredential(req, res, next) {
    try {
        // Vérifier les champs requis
        if (!req.body.password || !req.body.email || !req.body.phone) {
            return res.status(400).json({ "message": "Les champs password, email et phone sont requis" });
        }

        const credential = await CredentialsServices.createCredential(req.body);
        res.status(201).json(credential);
    } catch (error) {
        if (error.message === 'Les champs password, email et phone sont requis') {
            return res.status(400).json({ "message": error.message });
        }
        if (error.message === 'Cet email est déjà utilisé' || error.message === 'Ce numéro de téléphone est déjà utilisé') {
            return res.status(409).json({ "message": error.message });
        }
        return next(error);
    }
}

async function getCredentialById(req, res, next) {
    try {
        const credential = await CredentialsServices.getCredentialById(req.params.id);
        if (!credential) {
            return res.status(404).json({ "message": "Identifiant non trouvé" });
        }
        res.status(200).json(credential);
    } catch (error) {
        return next(error);
    }
}

async function updateCredential(req, res, next) {
    try {
        const credential = await CredentialsServices.updateCredential(req.params.id, req.body);
        if (!credential) {
            return res.status(404).json({ "message": "Identifiant non trouvé" });
        }
        res.status(200).json(credential);
    } catch (error) {
        if (error.message === 'Cet email est déjà utilisé' || error.message === 'Ce numéro de téléphone est déjà utilisé') {
            return res.status(409).json({ "message": error.message });
        }
        return next(error);
    }
}

async function deleteCredential(req, res, next) {
    try {
        const result = await CredentialsServices.deleteCredential(req.params.id);
        if (!result) {
            return res.status(404).json({ "message": "Identifiant non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllCredentials,
    createCredential,
    getCredentialById,
    updateCredential,
    deleteCredential
};