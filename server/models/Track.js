const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  duration: String,
  filePath: String, // Lien vers le fichier audio
  type: {
    type: String,
    enum: ["audio", "video"],
    default: "audio",
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});


const Track = mongoose.model("Track", trackSchema);



module.exports = Track; 

