# ESGI Airtable App

Application Next.js full-stack respectant les principes SOLID. Elle propose une interface de consultation en lecture d'une base Airtable ainsi qu'un backend d'API REST pour récupérer les enregistrements.

## Prérequis

- Node.js 20.0.0 ou supérieur (recommandé : 20 LTS)
- npm 10 ou supérieur
- Un compte Airtable avec un accès en lecture à la base cible

## Installation

```bash
npm install
```

## Configuration de l'environnement

1. Dupliquez le fichier `.env` (ou `.env.example`) en `.env.local`.
2. Renseignez les valeurs récupérées depuis Airtable :

```bash
AIRTABLE_API_KEY=sk_************************
AIRTABLE_BASE_ID=app****************
AIRTABLE_TABLE_ID=NomOuIdDeLaTable
```

- `AIRTABLE_API_KEY` : token personnel Airtable disposant des permissions `data.records:read`.
- `AIRTABLE_BASE_ID` : identifiant de la base (visible dans l'URL partageable ou via l'API Airtable).
- `AIRTABLE_TABLE_ID` : nom de la table ou ID encodé URL (par exemple `Table%201` si votre table s'appelle « Table 1 »).

> ⚠️ Ne commitez jamais vos valeurs réelles dans le dépôt. Conservez uniquement des exemples ou des tokens de développement.

### Accès en lecture à la base Airtable

1. Dans Airtable, rendez-vous dans *Developer Hub* puis créez un **Personal access token** avec le scope `data.records:read` et limitez-le à la base concernée.
2. Récupérez l'identifiant de la base depuis l'URL de partage (`https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYY/...`).
3. Facultatif : créez une vue filtrée dédiée à l'application pour mieux contrôler les données exposées.
4. Complétez le fichier `.env.local` avec ces informations puis redémarrez le serveur de développement.

## Lancer le projet

```bash
npm run dev
```

Le serveur Next.js (frontend + backend) démarre sur `http://localhost:3000` :
- Interface web de consultation : `/`
- API REST interne : `GET /api/records`

Pour exécuter la version de production :

```bash
npm run build
npm run start
```

## Vérifier la connexion Airtable

Vous pouvez valider la configuration en interrogeant l'API interne :

```bash
curl http://localhost:3000/api/records
```

## Architecture & principes SOLID

- **Single Responsibility** : chaque couche (configuration, client HTTP Airtable, dépôt, service, route) assume une responsabilité unique.
- **Open/Closed** : les implémentations (ex. `AirtableRecordsRepository`) peuvent être étendues sans modifier les interfaces de domaine.
- **Liskov Substitution** : le service consomme l'interface `RecordsRepository`, garantissant l'interchangeabilité.
- **Interface Segregation** : seules les méthodes nécessaires (`list`) sont exposées par le dépôt.
- **Dependency Inversion** : la composition des dépendances se fait via `createRecordsService`, qui fournit au domaine des interfaces plutôt que des implémentations concrètes.

## Technologies utilisées

- Next.js 15 (App Router) – frontend & backend unifiés
- React 19
- TypeScript
- Airtable REST API
- ESLint 9
- Tailwind CSS 4 (préconfiguré pour le stylage)

## Membres du groupe

- Petit Hugo : *Développeur*
- Poumailloux Léo : *Développeur*
- Serenne Arthur : *Développeur*
- Yildiz Erkant : *Développeur*

## Informations utiles supplémentaires

- Les requêtes Airtable sont effectuées côté serveur pour éviter toute exposition de l'API key.
- Les réponses API sont sans cache (`cache: 'no-store'`) pour toujours refléter l'état actuel de la base.
- Pour changer de table ou de vue, adaptez simplement les variables d'environnement sans modifier le code.
