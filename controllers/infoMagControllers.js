const InfoMagServices = require('../services/infoMagServices');

async function createInfoMag(req, res, next) {
    try {
        const infoMag = await InfoMagServices.createInfoMag(req.body);
        res.status(201).json(infoMag);
    } catch (error) {
        return next(error);
    }
}

async function getAllInfoMags(req, res, next) {
    try {
        const infoMags = await InfoMagServices.getAllInfoMags();
        res.status(200).json(infoMags);
    } catch (error) {
        return next(error);
    }
}

async function getInfoMagById(req, res, next) {
    try {
        const infoMag = await InfoMagServices.getInfoMagById(req.params.id);
        if (!infoMag) {
            return res.status(404).json({ message: "Information magasin non trouvée" });
        }
        res.status(200).json(infoMag);
    } catch (error) {
        return next(error);
    }
}

async function getTopBannerMessages(req, res, next) {
    try {
        const infoMags = await InfoMagServices.getTopBannerMessages();
        if (!infoMags || infoMags.length === 0) {
            return res.status(404).json({ message: "Aucune information magasin trouvée" });
        }
        res.status(200).json(infoMags);
    } catch (error) {
        return next(error);
    }
}

async function updateInfoMag(req, res, next) {
    try {
        const infoMag = await InfoMagServices.updateInfoMag(req.params.id, req.body);
        if (!infoMag) {
            return res.status(404).json({ message: "Information magasin non trouvée" });
        }
        res.status(200).json(infoMag);
    } catch (error) {
        return next(error);
    }
}

async function deleteInfoMag(req, res, next) {
    try {
        const result = await InfoMagServices.deleteInfoMag(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Information magasin non trouvée" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

// Contrôleurs spécifiques pour les messages topbar
async function getTopbarMessages(req, res, next) {
    try {
        const messages = await InfoMagServices.getTopbarMessages();
        res.status(200).json(messages);
    } catch (error) {
        return next(error);
    }
}

async function createTopbarMessage(req, res, next) {
    try {
        const messageData = { ...req.body, display: 'topbar' };
        const message = await InfoMagServices.createInfoMag(messageData);
        res.status(201).json(message);
    } catch (error) {
        return next(error);
    }
}

async function updateTopbarMessage(req, res, next) {
    try {
        const messageData = { ...req.body, display: 'topbar' };
        const message = await InfoMagServices.updateInfoMag(req.params.id, messageData);
        if (!message) {
            return res.status(404).json({ message: "Message topbar non trouvé" });
        }
        res.status(200).json(message);
    } catch (error) {
        return next(error);
    }
}

async function deleteTopbarMessage(req, res, next) {
    try {
        const result = await InfoMagServices.deleteInfoMag(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Message topbar non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createInfoMag,
    getAllInfoMags,
    getInfoMagById,
    updateInfoMag,
    deleteInfoMag,
    getTopBannerMessages,
    getTopbarMessages,
    createTopbarMessage,
    updateTopbarMessage,
    deleteTopbarMessage
};