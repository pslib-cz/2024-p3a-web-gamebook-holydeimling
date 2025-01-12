import ReactAudioPlayer from "react-audio-player";
import audio from "../assets/music/cesky-hello-neighbor-song-remix.mp3";
import { useRef, useState } from "react";
import radioImage from "../assets/radio.png";

type RadioProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export const Radio = ({ x, y, width, height }: RadioProps) => {
  const audioRef = useRef<ReactAudioPlayer>(null); // Create a ref for the audio player
  const [isPlaying, setIsPlaying] = useState(false); // State to track if the audio is playing
  const [volume, setVolume] = useState(1); // State to track the volume level (1 is max, 0 is mute)

  const toggleAudio = () => {
    if (audioRef.current && audioRef.current.audioEl.current) {
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
    if (audioRef.current && audioRef.current.audioEl.current) {
      audioRef.current.audioEl.current.volume = newVolume;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: `${y}%`,
        left: `${x}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <img
        src={radioImage}
        alt="radio"
        onClick={toggleAudio}
        style={{ width: width, height: height }}
      />
      <ReactAudioPlayer ref={audioRef} src={audio} volume={volume} />
      <label>
        Volume
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            rotate: "-90deg",
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        />
      </label>
    </div>
  );
};
