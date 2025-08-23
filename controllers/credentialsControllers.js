const CredentialsServices = require('../services/credentialsServices');

async function getAllCredentials(req, res) {
    try {
        const credentials = await CredentialsServices.getAllCredentials();
        res.status(200).json(credentials);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la récupération des identifiants" });
    }
}

async function createCredential(req, res) {
    try {
        // Vérifier les champs requis
        if (!req.body.password || !req.body.email || !req.body.phone) {
            return res.status(400).json({ "message": "Les champs password, email et phone sont requis" });
        }

        const credential = await CredentialsServices.createCredential(req.body);
        res.status(201).json(credential);
    } catch (error) {
        console.error(error);
        if (error.message === 'Les champs password, email et phone sont requis') {
            return res.status(400).json({ "message": error.message });
        }
        if (error.message === 'Cet email est déjà utilisé' || error.message === 'Ce numéro de téléphone est déjà utilisé') {
            return res.status(409).json({ "message": error.message });
        }
        res.status(500).json({ "message": "Une erreur est survenue lors de la création de l'identifiant" });
    }
}

async function getCredentialById(req, res) {
    try {
        const credential = await CredentialsServices.getCredentialById(req.params.id);
        if (!credential) {
            return res.status(404).json({ "message": "Identifiant non trouvé" });
        }
        res.status(200).json(credential);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la récupération de l'identifiant" });
    }
}

async function updateCredential(req, res) {
    try {
        const credential = await CredentialsServices.updateCredential(req.params.id, req.body);
        if (!credential) {
            return res.status(404).json({ "message": "Identifiant non trouvé" });
        }
        res.status(200).json(credential);
    } catch (error) {
        console.error(error);
        if (error.message === 'Cet email est déjà utilisé' || error.message === 'Ce numéro de téléphone est déjà utilisé') {
            return res.status(409).json({ "message": error.message });
        }
        res.status(500).json({ "message": "Une erreur est survenue lors de la mise à jour de l'identifiant" });
    }
}

async function deleteCredential(req, res) {
    try {
        const result = await CredentialsServices.deleteCredential(req.params.id);
        if (!result) {
            return res.status(404).json({ "message": "Identifiant non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Une erreur est survenue lors de la suppression de l'identifiant" });
    }
}

module.exports = {
    getAllCredentials,
    createCredential,
    getCredentialById,
    updateCredential,
    deleteCredential
};