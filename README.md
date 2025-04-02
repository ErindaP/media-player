# 🎵 Spotiflop x Tikflop - Media Player React  - Dziki Yanis

Spotiflop x Tikflop est un lecteur multimédia développé avec **React (Vite)** permettant de gérer et lire des fichiers audio et vidéo. Il se connecte à une API backend faites en Node.js/Express et MongoDB pour la gestion des médias.

---

## 🚀 Fonctionnalités  

### ✅ Lecture de fichiers audio et vidéo  
- Lecture des musiques et vidéos stockées sur le serveur.  
- Différenciation automatique entre audio et vidéo.  

### ✅ Ajout de médias 
- Upload d'un fichier via un formulaire.  
- Stockage et affichage des musiques après upload.  

### ✅ Contrôles de lecture  
- Lecture / Pause.  
- Changement de piste (suivant/précédent).  

### ✅ Affichage des métadonnées  
- Titre, artiste et album des morceaux.  
- Affichage sous forme de liste interactive.  

### ✅ Suppression de médias
- Un bouton pour supprimer une musique de la bibliothèque. 

### ✅ Like et Dislike de médias
- Un bouton pour aimer ou ne pas aimer une musique.
- Affichage des médias aimés en cliquant sur le bouton "Titres likés".

### ✅ Parsing à la main pour titre artiste album / extensions
- Parsing à la main du titre, artiste et album à partir du nom du fichier avec la sémantique : `titre-artiste_album.extension` (ex: `toto-mon-album-titi.mp3`).
- Parsing des extensions pour différencier les fichiers audio et vidéo. 






---

## 🛠 Installation & Lancement (Sans Docker malheureusement (je n'ai pas eu le temps de Dockeriser))

### Prérequis  
- **Node.js** (`>= 18.x`)  
- **npm** (`>= 9.x`)  
- **MongoDB**

---

### 📥 Installation du projet  
1. **Cloner le dépôt en ssh :**  
   ```sh
   git clone git@github.com:ErindaP/media-player.git
   cd media-player
   ```
2. **Installer les dépendances :**  
   ```sh
   cd client
   npm install
    cd ../server
    npm install
   ```

3. **Configurer la base de données :**
   ```	sh
    cd server
    node mongo-init.js
   ```
   - Assurez-vous que MongoDB est en cours d'exécution sur votre machine. (`systemctl start mongod` sous Linux je connais pas vraiment les services sur autre OS)
   - Le script `mongo-init.js` va créer une base de données nommée `media-player` et une collection nommée `medias`.



   
4. **Lancer le serveur :**  
   ```sh
   cd server
   node server.js
   ```
5. **Lancer le client :**  
   ```sh
   cd client
   npm run dev
   ```
6. **Accéder à l'application :**
7. Ouvrir votre navigateur et accéder à `http://localhost:5173` pour le client et `http://localhost:5000` pour le serveur (Ce dernier est optionnel, le client se connecte à l'API backend automatiquement).
8. **Télécharger des fichiers :**
   - Vous pouvez télécharger des fichiers audio et vidéo en utilisant les boutons  d'upload, d'abord sélectionner un fichier puis cliquer sur le bouton "Envoyer le média".

   - Les fichiers seront stockés dans le dossier `uploads` du serveur et ajoutés à la base de données.

9. **Lire des fichiers :**
   - Cliquez sur un fichier audio ou vidéo dans la liste pour le lire.
   - Vous pouvez également naviguer entre les fichiers audio et vidéo en utilisant les boutons "Suivant" et "Précédent".
   - Vous pouvez mettre en pause la lecture en cliquant sur le bouton "Pause" et reprendre la lecture en cliquant à nouveau sur le bouton "Lecture".
   - Vous pouvez également supprimer un fichier de la liste en cliquant sur le bouton "Supprimer" à côté du fichier.
   - Vous pouvez aimer ou ne pas aimer un fichier en cliquant sur le bouton "Like" ou "Dislike" à côté du fichier.
   - Vous pouvez également afficher les fichiers aimés en cliquant sur le bouton "Titres likés" en haut à gaucge de la page.



