// controllers/usersControllers.js
const UsersServices = require('../services/usersServices');

async function getAllUsers(_req, res, next) {
  try {
    const data = await UsersServices.getAllUsers();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { first_name, last_name, id_role, id_credential } = req.body;
    if (!first_name || !last_name || !id_role || !id_credential) {
      return next({ status: 400, code: 'VALIDATION', message: 'Champs requis manquants' });
    }
    const created = await UsersServices.createUser(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return next(error); // 1062 sur id_credential unique -> DUPLICATE
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await UsersServices.getUserById(req.params.id);
    if (!user) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Utilisateur non trouvé' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const updated = await UsersServices.updateUser(req.params.id, req.body);
    if (!updated) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Utilisateur non trouvé' });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const ok = await UsersServices.deleteUser(req.params.id);
    if (!ok) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Utilisateur non trouvé' });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    const client = await UsersServices.getUserInfoById(userId);
    if (!client) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(client);
  } catch (error) {
    return next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const userId = req.user.id;
    const client = await UsersServices.updateUserInfoById(userId, req.body);
    if (!client) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(client);
  } catch (error) {
    return next(error);
  }
}

async function getUserByEmail(req, res, next) {
    try {
        const client = await UsersServices.getUserByEmail(req.params.email);
        if (!client) {
            return res.status(404).json({ "message": "Client non trouvé" });
        }
        res.status(200);
        res.json(client);
    } catch (error) {
        return next(error);
    }
}

/**
 * Si tu avais une route de contact (ex: POST /users/contact),
 * on conserve le handler afin de ne RIEN casser côté front.
 * On délègue à UsersServices.contactMail(payload) (ou le nom existant).
 */
async function contactMail(req, res, next) {
  try {
    const result = await UsersServices.contactMail(req.body);
    // on renvoie 200 avec un message ou les métadonnées utiles
    return res.status(200).json(result || { message: 'Message envoyé' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  contactMail, // <— conservé si utilisé par tes routes/front
  getMe,
  updateMe,
  getUserByEmail,
};
