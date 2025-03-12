# Utilisation de l'image Node.js officielle
FROM node:18-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers du projet
COPY package.json package-lock.json ./
RUN npm install

# Copie du reste des fichiers
COPY . .

# Exposition du port
EXPOSE 5000

# Commande de démarrage
CMD ["node", "server.js"]
