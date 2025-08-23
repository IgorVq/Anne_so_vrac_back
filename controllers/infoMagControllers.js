const InfoMagServices = require('../services/infoMagServices');

async function createInfoMag(req, res) {
    try {
        const infoMag = await InfoMagServices.createInfoMag(req.body);
        res.status(201).json(infoMag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllInfoMags(req, res) {
    try {
        const infoMags = await InfoMagServices.getAllInfoMags();
        res.status(200).json(infoMags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getInfoMagById(req, res) {
    try {
        const infoMag = await InfoMagServices.getInfoMagById(req.params.id);
        if (!infoMag) {
            return res.status(404).json({ message: "Information magasin non trouvée" });
        }
        res.status(200).json(infoMag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getTopBannerMessages(req, res) {
    try {
        const infoMags = await InfoMagServices.getTopBannerMessages();
        if (!infoMags || infoMags.length === 0) {
            return res.status(404).json({ message: "Aucune information magasin trouvée" });
        }
        res.status(200).json(infoMags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateInfoMag(req, res) {
    try {
        const infoMag = await InfoMagServices.updateInfoMag(req.params.id, req.body);
        if (!infoMag) {
            return res.status(404).json({ message: "Information magasin non trouvée" });
        }
        res.status(200).json(infoMag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteInfoMag(req, res) {
    try {
        const result = await InfoMagServices.deleteInfoMag(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Information magasin non trouvée" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Contrôleurs spécifiques pour les messages topbar
async function getTopbarMessages(req, res) {
    try {
        const messages = await InfoMagServices.getTopbarMessages();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createTopbarMessage(req, res) {
    try {
        const messageData = { ...req.body, display: 'topbar' };
        const message = await InfoMagServices.createInfoMag(messageData);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateTopbarMessage(req, res) {
    try {
        const messageData = { ...req.body, display: 'topbar' };
        const message = await InfoMagServices.updateInfoMag(req.params.id, messageData);
        if (!message) {
            return res.status(404).json({ message: "Message topbar non trouvé" });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteTopbarMessage(req, res) {
    try {
        const result = await InfoMagServices.deleteInfoMag(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Message topbar non trouvé" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
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