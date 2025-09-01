const InfoMagServices = require('../services/infoMagServices');

async function createInfoMag(req, res, next) {
  try {
    const infoMag = await InfoMagServices.createInfoMag(req.body);
    return res.status(201).json(infoMag);
  } catch (error) {
    return next(error);
  }
}

async function getAllInfoMags(_req, res, next) {
  try {
    const infoMags = await InfoMagServices.getAllInfoMags();
    return res.status(200).json(infoMags);
  } catch (error) {
    return next(error);
  }
}

async function getInfoMagById(req, res, next) {
  try {
    const infoMag = await InfoMagServices.getInfoMagById(req.params.id);
    if (!infoMag) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Information magasin non trouvée' });
    }
    return res.status(200).json(infoMag);
  } catch (error) {
    return next(error);
  }
}

async function getTopBannerMessages(_req, res, next) {
  try {
    const infoMags = await InfoMagServices.getTopBannerMessages();
    if (!infoMags || infoMags.length === 0) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Aucune information magasin trouvée' });
    }
    return res.status(200).json(infoMags);
  } catch (error) {
    return next(error);
  }
}

async function updateInfoMag(req, res, next) {
  try {
    const infoMag = await InfoMagServices.updateInfoMag(req.params.id, req.body);
    if (!infoMag) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Information magasin non trouvée' });
    }
    return res.status(200).json(infoMag);
  } catch (error) {
    return next(error);
  }
}

async function deleteInfoMag(req, res, next) {
  try {
    const result = await InfoMagServices.deleteInfoMag(req.params.id);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Information magasin non trouvée' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function getTopbarMessages(_req, res, next) {
  try {
    const messages = await InfoMagServices.getTopbarMessages();
    return res.status(200).json(messages);
  } catch (error) {
    return next(error);
  }
}

async function createTopbarMessage(req, res, next) {
  try {
    const messageData = { ...req.body, display: 'topbar' };
    const message = await InfoMagServices.createInfoMag(messageData);
    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
}

async function updateTopbarMessage(req, res, next) {
  try {
    const messageData = { ...req.body, display: 'topbar' };
    const message = await InfoMagServices.updateInfoMag(req.params.id, messageData);
    if (!message) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Message topbar non trouvé' });
    }
    return res.status(200).json(message);
  } catch (error) {
    return next(error);
  }
}

async function deleteTopbarMessage(req, res, next) {
  try {
    const result = await InfoMagServices.deleteInfoMag(req.params.id);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Message topbar non trouvé' });
    }
    return res.status(204).send();
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
  deleteTopbarMessage,
};
