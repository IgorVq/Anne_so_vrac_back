const bcrypt = require('bcryptjs');
const CredentialsServices = require('../services/credentialsServices');
const RolesServices = require('../services/rolesServices');
const UsersServices = require('../services/usersServices');
const transporter = require('../config/nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: 'Email et mot de passe sont requis',
      });
    }

    const user = await UsersServices.getUserByEmail(email);
    if (!user) {
      return next({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Email ou mot de passe incorrect',
      });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return next({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Email ou mot de passe incorrect',
      });
    }

    return res.status(200).json({ token: generateToken(user) });
  } catch (error) {
    return next(error);
  }
}

async function register(req, res, next) {
  try {
    const {
      email,
      password,
      phone,
      first_name,
      last_name,
      role,
    } = req.body || {};

    if (!email || !password || !phone || !first_name || !last_name) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: 'Champs requis manquants',
      });
    }

    const mailExist = await UsersServices.getUserByEmail(email);
    if (mailExist) {
      return next({
        status: 409,
        code: 'DUPLICATE',
        message: 'Email déjà utilisé',
        field: 'email',
      });
    }

    const phoneExist = await UsersServices.getUserByPhone(phone);
    if (phoneExist) {
      return next({
        status: 409,
        code: 'DUPLICATE',
        message: 'Numéro de téléphone déjà utilisé',
        field: 'phone',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const credential = { email, password: hashedPassword, phone };

    const responseCredential = await CredentialsServices.createCredential(credential);
    if (!responseCredential) {
      return next({
        status: 500,
        code: 'INTERNAL',
        message: 'Erreur lors de la création des identifiants',
      });
    }

    const adminFlag = role && role.admin ? role.admin : 0;
    const responseRole = await RolesServices.createRole({ admin: adminFlag });
    if (!responseRole) {
      await CredentialsServices.deleteCredential(responseCredential.id_credential);
      return next({
        status: 500,
        code: 'INTERNAL',
        message: 'Erreur lors de la création du rôle',
      });
    }

    const newUser = {
      first_name,
      last_name,
      id_credential: responseCredential.id_credential,
      id_role: responseRole.id_role,
    };

    const createdUser = await UsersServices.createUser(newUser);
    if (!createdUser) {
      await CredentialsServices.deleteCredential(responseCredential.id_credential);
      await RolesServices.deleteRole(responseRole.id_role);
      return next({
        status: 500,
        code: 'INTERNAL',
        message: "Erreur lors de la création de l'utilisateur",
      });
    }

    const completeUser = await UsersServices.getUserByEmail(email);
    if (!completeUser) {
      return next({
        status: 500,
        code: 'INTERNAL',
        message: "Erreur lors de la récupération de l'utilisateur",
      });
    }

    return res.status(201).json({ token: generateToken(completeUser) });
  } catch (error) {
    return next(error);
  }
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id_user,
      email: user.email,
      last_name: user.last_name,
      first_name: user.first_name,
      admin: user.admin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '5d' }
  );
}

function verifyToken(req, _res, next) {
  try {
    const header = req.headers['authorization'];
    if (!header) {
      return next({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Aucun token fourni',
      });
    }

    const token = header.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return next({
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Non autorisé',
        });
      }
      req.user = decoded;
      return next();
    });
  } catch (error) {
    return next(error);
  }
}

function requireAdmin(req, _res, next) {
  try {
    if (!req.user || !('admin' in req.user)) {
      return next({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Accès interdit',
      });
    }
    if (req.user.admin !== 1) {
      return next({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Admin uniquement',
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: 'Email requis',
      });
    }

    const user = await UsersServices.getUserByEmail(email);
    if (!user) {
      return next({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Email incorrect',
      });
    }

    const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    await transporter.sendMail({
      from: "VERQUAIN Igor <igor.verquain@gmail.com>",
      to: user.email,
      subject: "Réinitialisation de mot de passe – Anne So'Vrac",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #2C3E50;">Réinitialisation de votre mot de passe</h2>
          <p>Bonjour <strong>${user.first_name} ${user.last_name}</strong>,</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le bouton ci-dessous pour procéder :</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:5173/resetPassword/${token}" 
               style="background-color: #3498db; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 16px;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
          <p>Cordialement,</p>
          <p><strong>L'équipe Anne So'Vrac</strong></p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    return next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const header = req.headers['authorization'];
    if (!header) {
      return next({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Aucun token fourni',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    } catch (_e) {
      return next({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Non autorisé',
      });
    }

    req.user = decoded;

    const { password } = req.body || {};
    if (!password) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: 'Mot de passe requis',
      });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const user = await UsersServices.updateUserPassword(req.user.id, { password: hashed });

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register,
  verifyToken,
  generateToken,
  requireAdmin,
  forgotPassword,
  resetPassword,
};
