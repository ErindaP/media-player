require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const trackRoutes = require("./routes/tracks");
const multer = require("multer");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/tracks", trackRoutes);



const fs = require("fs");
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}



// Connexion à MongoDB

mongoose.connect("mongodb://localhost:27017/media_player", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch(err => console.error("Erreur de connexion à MongoDB:", err));

  app.use("/uploads", express.static("uploads"));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


  console.log("Routes enregistrées :", app._router.stack.map(r => r.route && r.route.path));


app.listen(5000, () => console.log("Serveur sur http://localhost:5000"));
