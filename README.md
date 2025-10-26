# GameHub - Frontend

Frontend Vue.js d'une plateforme sociale gaming avec chat WebSocket en temps réel. Développé en équipe de 4 pour apprendre React, Laravel et les APIs REST.

## ✨ Fonctionnalités

- Chat temps réel avec WebSockets
- Système d'XP et progression gamifiée
- Feed social et partage d'expériences
- Profils utilisateurs personnalisables
- Recherche avancée avec Meilisearch
- Notifications temps réel
- Rating collaboratif des jeux

## 🛠️ Stack

- Vue.js 3, TypeScript, Vite, Tailwind CSS, Pinia, Axios, Laravel Echo

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
