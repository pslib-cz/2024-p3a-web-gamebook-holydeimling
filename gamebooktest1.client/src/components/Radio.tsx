import ReactAudioPlayer from "react-audio-player";
import audio1 from "../assets/music/cesky-hello-neighbor-song-remix.mp3";
import audio2 from "../assets/music/song1.mp3";
import { useRef, useState, useEffect } from "react";
import "./Radio.css";
import radioImage from "../assets/radio.png";

type RadioProps = {
  x?: number;
  y?: number;
};

export const Radio = ({ x, y }: RadioProps) => {
  const audioRef = useRef<ReactAudioPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  const audioTracks = [audio1, audio2];

  const toggleAudio = () => {
    if (audioRef.current?.audioEl.current) {
      if (isPlaying) {
        audioRef.current.audioEl.current.pause();
      } else {
        audioRef.current.audioEl.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current?.audioEl.current) {
      audioRef.current.audioEl.current.volume = newVolume;
    }
  };

  const nextTrack = () => {
    setCurrentAudioIndex((prev) => (prev + 1) % audioTracks.length);
  };

  const prevTrack = () => {
    setCurrentAudioIndex(
      (prev) => (prev - 1 + audioTracks.length) % audioTracks.length
    );
  };

  // Handle auto-play when switching tracks
  useEffect(() => {
    if (audioRef.current?.audioEl.current && isPlaying) {
      audioRef.current.audioEl.current.play();
    }
  }, [currentAudioIndex]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        bottom: `${y}%`,
        background: `url(${radioImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }}
      className="radioContainer"
    >
      <div className="radioBody">
        <div className="volumeControl">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        <div className="trackControls">
          <button onClick={prevTrack}>◀</button>

          <button onClick={toggleAudio}>{isPlaying ? "⏸" : "▶"}</button>

          <button onClick={nextTrack}>▶</button>
        </div>

        <ReactAudioPlayer
          key={currentAudioIndex}
          ref={audioRef}
          src={audioTracks[currentAudioIndex]}
          volume={volume}
          onEnded={nextTrack}
        />
      </div>
    </div>
  );
};
