# Utilisation de l'image Node.js officielle
FROM node:18-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers du projet
COPY package.json package-lock.json ./
RUN npm install

# Copie du reste des fichiers
COPY . .

# Build du projet React
RUN npm run build

# Utilisation d'un serveur Nginx pour servir l'application React
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Exposition du port
EXPOSE 80
