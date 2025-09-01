const CredentialsServices = require('../services/credentialsServices');

async function getAllCredentials(_req, res, next) {
  try {
    const credentials = await CredentialsServices.getAllCredentials();
    return res.status(200).json(credentials);
  } catch (error) {
    return next(error);
  }
}

async function createCredential(req, res, next) {
  try {
    const { password, email, phone } = req.body;
    if (!password || !email || !phone) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: 'Les champs password, email et phone sont requis',
      });
    }
    const credential = await CredentialsServices.createCredential(req.body);
    return res.status(201).json(credential);
  } catch (error) {
    return next(error);
  }
}

async function getCredentialById(req, res, next) {
  try {
    const credential = await CredentialsServices.getCredentialById(req.params.id);
    if (!credential) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Identifiant non trouvé' });
    }
    return res.status(200).json(credential);
  } catch (error) {
    return next(error);
  }
}

async function updateCredential(req, res, next) {
  try {
    const credential = await CredentialsServices.updateCredential(req.params.id, req.body);
    if (!credential) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Identifiant non trouvé' });
    }
    return res.status(200).json(credential);
  } catch (error) {
    return next(error);
  }
}

async function deleteCredential(req, res, next) {
  try {
    const ok = await CredentialsServices.deleteCredential(req.params.id);
    if (!ok) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Identifiant non trouvé' });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllCredentials,
  createCredential,
  getCredentialById,
  updateCredential,
  deleteCredential,
};
