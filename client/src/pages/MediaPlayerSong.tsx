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
}

export default function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Volume par défaut à 100%

  // Référence au lecteur audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Charger les musiques depuis l'API
  useEffect(() => {
    fetch("http://localhost:5000/tracks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données reçues :", data); // Debug
        setTracks(data);
      })
      .catch((error) => console.error("Erreur lors du chargement des tracks :", error));
  }, []);

  // Jouer une musique sélectionnée
  const playTrack = (track: Track) => {
    const trackUrl = `http://localhost:5000/tracks/play/${track._id}`;
    console.log("Lecture de la musique :", trackUrl);

    if (currentTrack === trackUrl && audioRef.current) {
      // Si la même musique est cliquée, recommence à zéro
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setCurrentTrack(trackUrl);
      setIsPlaying(true);

      // Force le rechargement du lecteur audio
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  };

  // Gestion du fichier sélectionné
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

    // Gérer la lecture et la pause
    const togglePlayPause = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    // Mise à jour de la barre de progression
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
  
    // Initialisation de la durée du fichier
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
  
    // Gérer le changement de volume
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    };

  // Envoi du fichier au serveur
  const uploadTrack = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier audio.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/tracks/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi du fichier");

      const newTrack = await response.json();
      setTracks((prevTracks) => [...prevTracks, newTrack]); // Ajouter la nouvelle musique à la liste
      setSelectedFile(null);
      alert("Musique ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Échec de l'ajout de la musique.");
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

  return (
    <div className="flex h-screen w-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-green-950 p-4 h-full">
        <h2 className="text-lg font-bold mb-4">Bibliothèque</h2>
        <ul>
          <li className="p-2 hover:bg-green-800 rounded">Titres likés</li>
          <li className="p-2 hover:bg-gray-800 rounded">Playlists</li>
          <li className="p-2 hover:bg-gray-800 rounded">Podcasts</li>
        </ul>

        {/* Ajout de musique */}
        <div className="mt-4">
          <input type="file" accept="audio/*" onChange={handleFileChange} className="mb-2" />
          <Button onClick={uploadTrack} className="w-full !bg-green-500 flex items-center gap-2">
            <Upload size={20} />
            Ajouter une musique
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/4 p-4 h-full overflow-y-auto">
        <Card className="bg-gradient-to-b from-orange-500 to-gray-800 p-6">
          <h1 className="text-4xl font-bold">Radio utopia</h1>
          <p className="text-gray-300">Avec miida, Foi, ぷにぷに電機 et d'autres artistes</p>
        </Card>

        <div className="mt-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="p-2">#</th>
                <th className="p-2">Titre</th>
                <th className="p-2">Album</th>
                <th className="p-2">Durée</th>
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
                    <td className="p-2">{track.duration}</td>
                    <td className="p-2">
                      <button onClick={(e) => {e.stopPropagation(); deleteTrack(track._id)}} className="!bg-green-800 text-red-500">
                        ❌
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

      {/* Album Covers */}
      <aside className="w-1/4 bg-gray-900 p-4 h-full flex flex-col gap-4 overflow-y-auto">
        {tracks.map((track) => (
          <Card key={track._id} className="p-2">
            <CardContent className="text-center">
              <p className="text-sm">{track.album || "Album inconnu"}</p>
            </CardContent>
          </Card>
        ))}
      </aside>

      {/* Media Controls */}
      <footer className="fixed bottom-0 left-0 w-full bg-black p-4 flex flex-col items-center gap-4">
        <div className="flex  items-center gap-4">
          <Button className="!bg-green-500" variant="ghost">
            <SkipBack size={20} />
          </Button>
          <Button onClick={togglePlayPause} className='!bg-green-500' variant="ghost">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button className="!bg-green-500" variant="ghost">
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
              if (audioRef.current) audioRef.current.currentTime = newTime;
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
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack}
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}
    </div>
  );
}
