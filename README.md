# ESGI Airtable App

Application Next.js full-stack respectant les principes SOLID. Elle propose une interface de portfolio permettant de consulter des projets depuis une base Airtable, de créer un compte utilisateur, de s'authentifier et de gérer son profil.

## Prérequis

- Node.js 20.0.0 ou supérieur (recommandé : 20 LTS)
- npm 10 ou supérieur
- Un compte Airtable avec un accès en lecture/écriture à la base cible

## Installation

```bash
npm install
```

## Configuration de l'environnement

1. Dupliquez le fichier `.env.example` en `.env.local`.
2. Renseignez les valeurs récupérées depuis Airtable :

```ini
AIRTABLE_API_KEY=TOKEN_SECRET_API_KEY
AIRTABLE_BASE_ID=TOKEN_SECRET_BASE_ID
AIRTABLE_TABLE_ID=TOKEN_SECRET_TABLE_ID
AIRTABLE_USERS_TABLE_ID=TOKEN_SECRET_USERS_TABLE_ID
AIRTABLE_LIKES_TABLE_ID=TOKEN_SECRET_LIKES_TABLE_ID

JWT_SECRET=TOKEN_SECRET
```

### Variables d'environnement

- `AIRTABLE_API_KEY` : Token personnel Airtable disposant des permissions `data.records:read` et `data.records:write`.
- `AIRTABLE_BASE_ID` : Identifiant de la base.
- `AIRTABLE_TABLE_ID` : Nom ou ID de la table contenant les **projets** (Portfolio).
- `AIRTABLE_USERS_TABLE_ID` : Nom ou ID de la table contenant les **utilisateurs**.
- `AIRTABLE_LIKES_TABLE_ID` : Nom ou ID de la table contenant les **likes**.
- `JWT_SECRET` : Une chaîne aléatoire utilisée pour signer les tokens d'authentification.

## Lancer le projet

```bash
npm run dev
```

Le serveur Next.js démarre sur `http://localhost:3000` :

- **Page d'accueil / Recherche** : `/` (avec filtre par tag et tri).
- **Authentification** : `/auth/login` et `/auth/signup`.
- **Profil Utilisateur** : `/profile`.

Pour exécuter la version de production :

```bash
npm run build
npm run start
```

## Fonctionnalités

### Portfolio & Recherche
- Liste des projets depuis Airtable.
- Recherche par nom ou tag.
- Filtrage par tag.
- **Tri** : Les résultats peuvent être triés par nom (croissant/décroissant).

### Authentification & Utilisateurs
- Inscription (Email, Mot de passe sécurisé).
- Connexion (JWT en cookie `httpOnly`).
- Gestion de profil : modification des informations personnelles (Nom, Bio, Localisation...) stockées dans Airtable.
- Suppression de compte.

## Architecture & principes SOLID

Le projet applique une architecture modulaire stricte :

- **Core** : Clients HTTP génériques (`AirtableHttpClient`).
- **Services** : Logique métier (`AuthService`, `SearchPortfolioService`).
- **API Routes** : Points d'entrée backend (`/api/auth/*`, `/api/search/*`).
- **Components** : Composants React réutilisables (`SearchBar`, `Navbar`).

## Technologies utilisées

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **UI** : React 19, Tailwind CSS 4
- **Base de données** : Airtable (via API REST)
- **Validation** : Zod
- **Sécurité** : BCryptJS (hachage mots de passe), JWT
- **Linter** : ESLint 9

## Membres du groupe

- Petit Hugo : *Développeur*
- Poumailloux Léo : *Développeur*
- Serenne Arthur : *Développeur*
- Yildiz Erkant : *Développeur*
