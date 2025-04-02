import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Track {
  _id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  filePath: string; // URL du fichier audio
  type: "audio" | "video"; // Type de média
  isLiked: boolean; // Indique si la musique est likée

  
}

export default function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<string| null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); 


  // Référence au lecteur audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Charger les musiques depuis l'API de la base de données
  useEffect(() => {
    fetch("http://localhost:5000/tracks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données reçues :", data); // Debug
        setTracks(data);
      })
      .catch((error) => console.error("Erreur lors du chargement des tracks :", error));
  }, []);

  // Jouer un média sélectionnée
  const playTrack = (track: Track) => {
    setSelectedMedia(track);
    console.log("Track sélectionnée :", track);
    if (track.type === "video") {
      
      const trackUrl = `http://localhost:5000/tracks/play/${track._id}`;
      console.log("Lecture de la vidéo :", trackUrl);
      if (videoRef.current) {
        videoRef.current.src = trackUrl;
        videoRef.current.play();
      }
      setCurrentTrack(trackUrl);
      setIsPlaying(true);
      // Force le rechargement du lecteur vidéo
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play();
      }
      setIsPlaying(true);

      // Si la même vidéo est cliquée, recommence à zéro
      if (currentTrack === trackUrl && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        setCurrentTrack(trackUrl);
        setIsPlaying(true);

        // Force le rechargement du lecteur vidéo (à cause de pbs quand on changeait de média)
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play();
        }
      }

      return;
    }

    if (track.type === "audio") {
    const trackUrl = `http://localhost:5000/tracks/play/${track._id}`;
    console.log("Lecture de la musique :", trackUrl);

    if (currentTrack === trackUrl && audioRef.current) {
      // Si la même musique est cliquée, recommence à zéro
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setCurrentTrack(trackUrl);
      setIsPlaying(true);

      // Force le rechargement du lecteur audio (à cause de pbs quand on changeait de média)
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  }
  };

  // Gestion du fichier sélectionné
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      console.log(selectedFile);
    }

  };

    // Gérer la lecture et la pause
    const togglePlayPause = () => {
      if (selectedMedia?.type === "audio" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      } else if (selectedMedia?.type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      }
      setIsPlaying(!isPlaying);
    };
  
    // Mise à jour de la barre de progression
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }

      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }


    };
  
    // Initialisation de la durée du fichier
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      
      }

      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }


    };
  
    // Gérer le changement de volume
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }
      
    };

// Récupérer la liste des musiques

  const fetchTracks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tracks");
      if (!response.ok) throw new Error("Erreur lors de la récupération des musiques");
      const data = await response.json();
      setTracks(data);
    } catch (error) {
      console.error("Erreur fetchTracks:", error);
      alert("Échec de la récupération des musiques.");
    }
  };

  
  // Envoi du fichier au serveur
  const uploadTrack = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier audio ou vidéo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const mediaType = fileExtension === "mp4" || fileExtension === "mkv" || fileExtension === "webm" ? "video" : "audio";

      const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, ""); // Supprimer l'extension
      const [titlePart, albumPart] = fileNameWithoutExtension.split("_");
      const [title, artist] = titlePart.split("-");
      

      const metadata = {
        title: title || "Inconnu",
        artist: artist || "Inconnu",
        album: albumPart || "Inconnu",
        type: mediaType,
      };

      formData.append("metadata", JSON.stringify(metadata));
      
      console.log("Titre :", title);
      console.log("Artiste :", artist);
      console.log("Album :", albumPart);
      console.log("Type de média :", mediaType);
      console.log("Fichier sélectionné :", selectedFile);
      console.log("FormData :", formData);
      

      const response = await fetch("http://localhost:5000/tracks/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi du fichier");

      const newTrack = await response.json();

      setTracks((prevTracks) => [...prevTracks, newTrack]); 

      setSelectedFile(null);
      alert("Média ajouté avec succès !");
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Échec de l'ajout du média.");
    }
  };

  // Suppr une musique
  const deleteTrack = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/tracks/delete/${id}`, { method: "DELETE" });
      setTracks(tracks.filter(track => track._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  // Like or Unlike un media 
  const toggleLikeTrack = async (id: string, isLiked: boolean) => {
    try {
      const endpoint = isLiked
        ? `http://localhost:5000/tracks/unlike/${id}`
        : `http://localhost:5000/tracks/like/${id}`;
      const response = await fetch(endpoint, { method: "POST" });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour du like");

      const updatedTrack = await response.json();
      setTracks((prevTracks) =>
        prevTracks.map((track) => (track._id === id ? updatedTrack : track))
      );
      alert(isLiked ? "Média unliké avec succès !" : "Média liké avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du like :", err);
      alert("Échec de la mise à jour du like du média.");
    }
  };




  return (
    <div className="flex h-screen w-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-green-950 p-4 h-full">
      <h2 className="text-lg font-bold mb-4">Bibliothèque</h2>
      <ul>
        <li
        className="p-2 hover:bg-green-800 rounded cursor-pointer"
        onClick={() => fetchTracks()}
        >
        Tous les titres
        </li>
        <li
        className="p-2 hover:bg-green-800 rounded cursor-pointer"
        onClick={() => setTracks(tracks.filter((track) => track.isLiked))}
        >
        Titres likés
        </li>
  
      </ul>

      {/* Ajout de musique */}
      <div className="mt-4">
        <Button
        onClick={() => document.getElementById("fileInput")?.click()}
        className="w-full !bg-green-500 flex items-center gap-2"
        >
        <Upload size={20} />
        Sélectionner un média
        </Button>
        <input
        id="fileInput"
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        />
        <Button onClick={uploadTrack} className="w-full !bg-green-500 flex items-center gap-2 mt-2">
        <Upload size={20} />
        Envoyer le média
        </Button>
      </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/4 p-4 h-full overflow-y-auto">
      <Card className="bg-gradient-to-b from-green-500 to-gray-800 p-6">
        <h1 className="text-4xl font-bold">Spotiflop</h1>
        <p className="text-gray-300">
      Avec{" "}
      {tracks.slice(0, 2).map((track, index) => (
        <span key={track._id}>
        {track.artist}
        {index < 1 && tracks.length > 1 ? ", " : ""}
        </span>
      ))}
        </p>
      </Card>

      <div className="mt-6">
        <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
          <th className="p-2">#</th>
          <th className="p-2">Titre</th>
          <th className="p-2">Album</th>
          <th className="p-2">Actions</th>

          </tr>
        </thead>
        <tbody>
          {Array.isArray(tracks) ? (
          tracks.map((track, index) => (
            <tr 
            key={index} 
            className="border-b border-gray-800 hover:bg-gray-800" 
            onClick={() => playTrack(track)}
            >
            <td className="p-2">{index + 1}</td>
            <td className="p-2">{track.title} - {track.artist}</td>
            <td className="p-2">{track.album}</td>
            <td className="p-2 flex items-center gap-2">
              <button onClick={(e) => {e.stopPropagation(); deleteTrack(track._id)}} className="!bg-green-800 text-red-500">
              ❌
              </button>
              <button onClick={(e) => {e.stopPropagation(); toggleLikeTrack(track._id, track.isLiked)}} className="!bg-green-800 text-red-500">
              {track.isLiked ? "❤️" : "🤍"}
              </button>
            </td>
            </tr>
          ))
          ) : (
          <tr>
            <td colSpan={4} className="text-center p-4">Chargement des musiques...</td>
          </tr>
          )}
        </tbody>
        </table>
      </div>
      </main>

      {/* Video player */}
      <div
      className={`${
        selectedMedia?.type === "video" ? "w-2/4" : "w-1/4"
      } bg-gray-900 p-4 h-full flex flex-col gap-4 overflow-y-auto transition-all duration-300`}
      >
      <Card className="bg-gradient-to-b from-green-500 to-gray-800 p-6">
        <h1 className="text-4xl font-bold">TikFlop</h1>
      </Card>
      {selectedMedia?.type === "video" && (
        <video
      ref={videoRef}
      src={`http://localhost:5000/tracks/play/${selectedMedia._id}`}
      controls
      autoPlay
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      className="w-auto h-[60%]" 
        />
      )}
      </div>

      {/* Media Controls */}
      <footer className="fixed bottom-0 left-0 w-full bg-black p-4 flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Button
      className="!bg-green-500"
      variant="ghost"
      onClick={() => {
        const currentIndex = tracks.findIndex((track) => track._id === selectedMedia?._id);
        if (currentIndex > 0) {
        playTrack(tracks[currentIndex - 1]);
        }
      }}
        >
      <SkipBack size={20} />
        </Button>
        <Button onClick={togglePlayPause} className='!bg-green-500' variant="ghost">
      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button
      className="!bg-green-500"
      variant="ghost"
      onClick={() => {
        const currentIndex = tracks.findIndex((track) => track._id === selectedMedia?._id);
        if (currentIndex < tracks.length - 1) {
        playTrack(tracks[currentIndex + 1]);
        }
      }}
        >
      <SkipForward size={20} />
        </Button>
      </div>

      {/* Barre de progression */}
      <div className="w-full flex items-center gap-4">
        <span className="text-sm">{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, "0")}</span>
        <input
      type="range"
      min="0"
      max={duration}
      value={currentTime}
      onChange={(e) => {
        const newTime = parseFloat(e.target.value);
        if (selectedMedia?.type === "audio" && audioRef.current) {
        audioRef.current.currentTime = newTime;
        } else if (selectedMedia?.type === "video" && videoRef.current) {
        videoRef.current.currentTime = newTime;
        }
        setCurrentTime(newTime);
      }}
      className="w-full"
        />
        <span className="text-sm">{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}</span>
      </div>

      {/* Contrôle du volume */}
      <div className="flex items-center gap-2">
        <span className="text-sm">🔈</span>
        <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={volume}
      onChange={handleVolumeChange}
      className="w-32"
        />
        <span className="text-sm">🔊</span>
      </div>
      </footer>

      {/* Audio Player */}
      {
      // Vérifier si selectedMedia est une musique
      // Si oui, afficher le lecteur audio
      selectedMedia?.type === "audio" && (
      <audio
        ref={audioRef}
        src={`http://localhost:5000/tracks/play/${selectedMedia._id}`}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      )

      }


      

    </div>
  );
}
