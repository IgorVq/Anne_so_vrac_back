# Anne_so_vrac_back

API backend du projet Anne_so_vrac, développée avec Node.js et Express.

## Prérequis
- Node.js >= 18
- npm ou yarn
- MySQL (local ou distant)

## Installation

1. Cloner le dépôt et se placer dans le dossier backend :
   ```bash
   git clone <url-du-repo>
   cd Anne_so_vrac_back
   npm install
   ```
2. Copier le fichier d'exemple d'environnement :
   ```bash
   cp placeholder.env .env
   ```
   Puis renseigner les variables nécessaires dans `.env` (connexion MySQL, email, etc).

## Lancement du serveur
```bash
npm start
```

L'API sera accessible sur `http://localhost:3000` (par défaut).

## Structure principale
- `routes/` : Définition des routes API
- `controllers/` : Logique métier
- `services/` : Accès aux données et logique avancée
- `middleware/` : Middlewares Express
- `uploads/` : Fichiers uploadés
- `config/` : Configuration (BDD, email...)
- `src/app.js` : Point d'entrée principal

## Fonctionnalités
- Authentification JWT
- Gestion des utilisateurs, rôles, produits, commandes, réservations
- Upload d'images
- Gestion du panier et des paiements
- Interface d'administration (via le front)

## Développement
- Node.js, Express, MySQL
- Swagger pour la documentation API (`swagger.json`)

## Contribution
Les contributions sont les bienvenues !

## Licence
Projet privé.
