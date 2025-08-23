const UsersServices = require('../services/usersServices');
const CredentialsServices = require('../services/credentialsServices');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');

async function getAllUsers(req, res, next) {
    try {
        const clients = await UsersServices.getAllUsers();
        res.status(200);
        res.json(clients);
    } catch (error) {
        return next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const client = await UsersServices.createUser(req.body);
        res.status(201);
        res.json(client);
    } catch (error) {
        return next(error);
    }
}

async function contactMail(req, res, next) {
    try {
        await transporter.sendMail({
            from: 'VERQUAIN Igor <igor.verquain@gmail.com>',
            to: "igor.verquain@gmail.com",
            subject: `⚙️ Assistance ${req.body.name} – Anne So'Vrac`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
  <h2 style="color: #2C3E50; border-bottom: 1px solid #ccc; padding-bottom: 10px;">📩 Nouvelle demande d'assistance</h2>

  <p style="font-size: 16px;">Bonjour,</p>

  <p style="font-size: 16px; line-height: 1.6;">
    Vous avez reçu une nouvelle demande d'assistance de la part de :
    <br />
    <strong>${req.body.name}</strong> &lt;<a href="mailto:${req.body.email}" style="color: #3498db;">${req.body.email}</a>&gt;
  </p>

  <p style="font-size: 16px; line-height: 1.6;">Voici son message :</p>

  <div style="background-color: #fff; border: 1px solid #ccc; border-radius: 6px; padding: 15px; font-style: italic; margin: 20px 0;">
    ${req.body.message}
  </div>

  <p style="font-size: 14px; color: #555;">
    Merci de traiter cette demande dans les meilleurs délais.<br />
    Si vous avez besoin de contacter l'expéditeur, vous pouvez répondre directement à cette adresse : <a href="mailto:${req.body.email}" style="color: #3498db;">${req.body.email}</a>.
  </p>

  <hr style="margin: 30px 0;" />

  <p style="font-size: 12px; color: #999; text-align: center;">
    Ce message a été généré automatiquement à partir du formulaire de contact de votre site. Veuillez ne pas y répondre directement.
  </p>
</div>
    `
        });
        res.status(200).json({ message: 'Email de reintialisation envoyé' });
    } catch (error) {
        return next(error);
    }
}

async function getUserById(req, res, next) {
    try {
        const client = await UsersServices.getUserById(req.params.id);
        if (!client) {
            res.status(404);
            res.json({ "message": "Client non trouvé" });
            return;
        }
        res.status(200);
        res.json(client);
    } catch (error) {
        return next(error);
    }
}

async function getMe(req, res, next) {
    try {
        const userId = req.user.id;
        const client = await UsersServices.getUserInfoById(userId);
        if (!client) {
            return res.status(404).json({ "message": "Client non trouvé" });
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
            return res.status(404).json({ "message": "Client non trouvé" });
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

async function updateUser(req, res, next) {
    try {
        const client = await UsersServices.updateUser(req.params.id, req.body);
        res.status(200);
        res.json(client);
    } catch (error) {
        return next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        await UsersServices.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        return next(error);
    }
}



module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    contactMail,
    getMe,
    updateMe
};