# Gamehub - front
## Description
Fronted Vue.js du projet Gamehub.
## Installation
### Mise en place des variables d'environnement
1. Copier le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```
2. Modifier les variables d'environnement dans le fichier `.env` :
    1. Host de l'API (`VITE_BACKEND_HOST`) : URL de l'API Laravel
## Lancer le projet
### Manuellement
#### Prérequis
- Node.js ^20
##### Installation des dépendances
```bash
npm i
```
ou votre autre package manager
#### Commandes
##### Lancer le serveur Vue.js
```bash
npm run dev
```
Ou avec le package manager de votre choix.
### Avec Docker Compose
```bash
docker compose up
```
---
Le site est normalement accessible à l'adresse http://localhost:5173 ou http://localhost:80 si vous utilisez Docker Compose.
Lien du backend : https://github.com/saamue3l/gamehub-back
