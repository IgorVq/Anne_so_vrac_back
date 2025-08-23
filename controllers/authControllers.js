const bcrypt = require('bcryptjs');
const CredentialsServices = require('../services/credentialsServices');
const RolesServices = require('../services/rolesServices');
const UsersServices = require('../services/usersServices');
const transporter = require('../config/nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function login(req, res, next){
    try {
        const user = await UsersServices.getUserByEmail(req.body.email);
        if (!user) {
            return res.status(401).json({message: 'Email ou mot de passe incorrect'});
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({message: 'Email ou mot de passe incorrect'});
        }
        res.status(200).json({token: generateToken(user)});
    } catch (error) {
        return next(error);
    }
}

async function register(req, res, next){
    try {
        const mailExist = await UsersServices.getUserByEmail(req.body.email);
        if (mailExist) {
            return res.status(400).json({message: 'Email déjà utilisé'});
        }
        const phoneExist = await UsersServices.getUserByPhone(req.body.phone);
        if (phoneExist) {
            return res.status(400).json({message: 'Numéro de téléphone déjà utilisé'});
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const credential = {
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
        };

        const responseCredential = await CredentialsServices.createCredential(credential);
        if (!responseCredential) {
            return res.status(500).json({message: 'Erreur lors de la création des identifiants'});
        }

        if (!req.body.role || !req.body.role.admin) {
            req.body.role = 0; // Par défaut, le rôle est utilisateur
        }
        const responseRole = await RolesServices.createRole({admin: req.body.role});
        if (!responseRole) {
            // Nettoyer les credentials créés en cas d'erreur
            await CredentialsServices.deleteCredential(responseCredential.id_credential);
            return res.status(500).json({message: 'Erreur lors de la création du rôle'});
        }

        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            id_credential: responseCredential.id_credential,
            id_role: responseRole.id_role
        };

        const createdUser = await UsersServices.createUser(newUser);
        if (!createdUser) {
            // Nettoyer les credentials et le rôle créés en cas d'erreur
            await CredentialsServices.deleteCredential(responseCredential.id_credential);
            await RolesServices.deleteRole(responseRole.id_role);
            return res.status(500).json({message: 'Erreur lors de la création de l\'utilisateur'});
        }

        // Récupérer l'utilisateur complet avec ses credentials et son rôle
        const completeUser = await UsersServices.getUserByEmail(req.body.email);
        if (!completeUser) {
            return res.status(500).json({message: 'Erreur lors de la récupération de l\'utilisateur'});
        }

        res.status(201).json({token: generateToken(completeUser)});
    } catch (error) {
        
        return next(error);
    }
}

function generateToken(user){
    return jwt.sign({
        id: user.id_user,
        email: user.email,
        last_name: user.last_name,
        first_name: user.first_name,
        admin: user.admin
    }, process.env.JWT_SECRET, {
        expiresIn: "5d"
    });
}

function verifyToken(req, res, next){
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({message: 'Aucun token fourni'});
    }

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({message: 'Non autorisé'});
        }
        req.user = decoded;
        next();
    });
}

function requireAdmin(req, res, next) {
    if (!req.user || !req.user.admin) {
        return res.status(403).json({ error: 'Accès interdit' });
    }

    if (req.user.admin !== 1) { 
        return res.status(403).json({ error: 'Admin uniquement' });
    }
    next();
}

async function forgotPassword(req, res, next) {
    try {
        const user = await UsersServices.getUserByEmail(req.body.email);
        if (!user) {
            return res.status(401).json({ message: 'Email incorrect' });
        }
        const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });
        await transporter.sendMail({
            from: 'VERQUAIN Igor <igor.verquain@gmail.com>',
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
    `
        });
        res.status(200).json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
        
        return next(error);
    }
}

async function resetPassword(req, res, next) {
    try {
        jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Non autorisé' + err.message });
            }
            req.user = decoded;
        });
        const user = await UsersServices.updateUserPassword(req.user.id, { password: bcrypt.hashSync(req.body.password, 10) });
        res.status(200);
        res.json(user);
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
    resetPassword
}