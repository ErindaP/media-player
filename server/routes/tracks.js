const express = require("express");
const multer = require("multer");
const path = require("path");
const Track = require("../models/Track").default || require("../models/Track");
const fs = require("fs");


console.log("Track model:", Track);
const router = express.Router();

// 📂 Configuration de Multer pour stocker les fichiers audio
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
// 🎵 **Endpoint pour ajouter une musique (Upload)**
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu." });
        }

        console.log("Fichier reçu :", req.file);
        console.log("Données reçues :", req.body);

        // Access the metadata field from the body
        const metadata = JSON.parse(req.body.metadata || "{}");
        const {title, artist, album, duration, type } = metadata; // Destructure metadata fields

        console.log("Metadata :", metadata);
        console.log("Artist :", artist);
        console.log("Album :", album);
        console.log("Type :", type);
        console.log("Duration :", duration);
        const newTrack = new Track({
            title: title || "Inconnu",
            artist: artist || "Inconnu",
            album: album || "Non classé",
            duration: duration || "0:00", // Durée par défaut (à calculer si possible)
            type: type || "Inconnu",
            filePath: `/uploads/${req.file.filename}`,
        });

        await newTrack.save();
        res.json(newTrack);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete("/delete/:id", async (req, res) => {
    try {
      const track = await Track.findByIdAndDelete(req.params.id);
      if (!track) return res.status(404).json({ error: "Musique introuvable" });
  
      // 🔥 Supprimer le fichier physique si présent
      const filePath = path.join(__dirname, "..", track.filePath);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Erreur lors de la suppression du fichier :", err);
      });
  
      res.json({ message: "Musique et fichier supprimés avec succès !" });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression de la musique." });
    }
  });

// Endpoint pour ajouter une musique aux musiques likées

router.post("/like/:id", async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        if (!track) return res.status(404).json({ error: "Musique introuvable" });
  
        // Ajoutez la logique pour ajouter la musique aux musiques likées
        // Par exemple, vous pouvez ajouter un champ `liked` dans le modèle Track
        track.isLiked = true;
        await track.save();
  
        res.json(track);
        console.log("Musique ajoutée aux musiques likées :", track);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'ajout de la musique aux musiques likées." });
    }
}
);

// Endpoint pour récupérer les musiques likées

router.get("/liked", async (req, res) => {
    try {
        const likedTracks = await Track.find({ liked: true });
        res.json(likedTracks);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des musiques likées." });
    }
}
);

// Endpoint pour retirer une musique des musiques likées

router.post("/unlike/:id", async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        console.log("Track trouvé :", track);
        if (!track) return res.status(404).json({ error: "Musique introuvable" });
        console.log("Track avant la modification :", track);
        // Ajoutez la logique pour retirer la musique des musiques likées
        track.isLiked = false;
        await track.save();
        res.json(track);
        console.log("Musique retirée des musiques likées :", track);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors du retrait de la musique des musiques likées." });
    }
}
);

  
  



// 📜 **Endpoint pour récupérer toutes les musiques**
router.get("/", async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des musiques." });
  }
});

// 🎶 **Endpoint pour jouer une musique**
router.get("/play/:id", async (req, res) => {
    try {
      console.log("ID de la musique :", req.params.id);
      const track = await Track.findById(req.params.id);
      console.log("Musique trouvée :", track);
  
      if (!track) return res.status(404).json({ error: "Musique introuvable" });
  
      const filePath = path.join(__dirname, "..", track.filePath);
      console.log("Chemin du fichier généré :", filePath);
  
      // Vérifiez si le fichier existe réellement
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Fichier introuvable sur le serveur." });
      }
  
      res.sendFile(filePath);
      console.log("Fichier envoyé :", filePath);
    } catch (err) {
      console.error("Erreur lors de la lecture du fichier :", err);
      res.status(500).json({ error: "Erreur lors de la lecture du fichier audio." });
    }
  });
  

module.exports = router;
