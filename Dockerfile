# Utiliser une image Node.js Alpine
FROM node:18-alpine as BUILD_IMAGE

# Définir le répertoire de travail
WORKDIR /app
# WORKDIR /app/react-app

# Copier le package.json et le package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application React
RUN npm run build

# Exposer le port 80
EXPOSE 80

# Commande de démarrage de l'application
CMD ["npm", "run", "start"]