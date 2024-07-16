# Utilisation d'une image de base Node.js
FROM node:14

# Définition du répertoire de travail dans l'image Docker
WORKDIR /app

# Installation des dépendances du projet
COPY package*.json ./
RUN npm install

# Copie du reste du code source dans l'image Docker
COPY . .

# Build de l'application React
RUN npm run build

# Commande pour démarrer l'application React (adapter selon votre projet)
CMD ["npm", "start"]
