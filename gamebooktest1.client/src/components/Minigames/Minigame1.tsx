import { useState, useEffect, useCallback, useRef } from "react";
import packageImage from "../../assets/Mini/cartonBox.png"; //upravit cesty jakmile obrazek
import { Scene } from "../../types";
import { useNavigate } from "react-router-dom";
import truckImage from "../../assets/Mini/carPlayer.png"; //upravit cesty jakmile obrazek
import playerImage from "../../assets/Mini/mainCharacter.png"; //upravit cesty jakmile obrazek
import roadTexture from "../../assets/Mini/road.jpg";
import arrowsIcon from "../../assets/arrowsIcon.png";
import "./Minigame1.css";

interface Package {
  id: number;
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
}

type MinigameTruckProps = {
  currentScene: Scene;
  showPauseMenu: boolean;
};

export const Minigame1 = ({
  currentScene,
  showPauseMenu,
}: MinigameTruckProps) => {
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;
  const PLAYER_SIZE = 250;
  const PACKAGE_SIZE = 80;
  const TRUCK_SIZE = 250;
  const MOVE_SPEED = 10;
  const GAME_DURATION = 60;
  const MAX_PACKAGES = 5;

  const [playerPos, setPlayerPos] = useState<Position>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
  });
  const [truckPos] = useState<Position>({
    x: 50,
    y: GAME_HEIGHT / 2 - TRUCK_SIZE / 2,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [carryingPackage, setCarryingPackage] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showMinigameDone, setShowMinigameDone] = useState<boolean>(false);

  const navigate = useNavigate();
  const pressedKeys = useRef<Set<string>>(new Set()); // Changed to useRef

  const checkCollision = (
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };
  // Player movement
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || showMinigameDone || !gameStarted || showPauseMenu) return;
      pressedKeys.current.add(e.key);
    },
    [gameOver, showMinigameDone, gameStarted, showPauseMenu]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    pressedKeys.current.delete(e.key);
  }, []);

  useEffect(() => {
    const movePlayer = () => {
      if (gameOver || showMinigameDone || !gameStarted || showPauseMenu) return;

      setPlayerPos((prev) => {
        const newPos = { ...prev };
        if (pressedKeys.current.has("ArrowUp")) {
          newPos.y = Math.max(0, prev.y - MOVE_SPEED);
        }
        if (pressedKeys.current.has("ArrowDown")) {
          newPos.y = Math.min(GAME_HEIGHT - PLAYER_SIZE, prev.y + MOVE_SPEED);
        }
        if (pressedKeys.current.has("ArrowLeft")) {
          newPos.x = Math.max(0, prev.x - MOVE_SPEED);
        }
        if (pressedKeys.current.has("ArrowRight")) {
          newPos.x = Math.min(GAME_WIDTH - PLAYER_SIZE, prev.x + MOVE_SPEED);
        }

        // Check collision with truck
        const playerRect = {
          x: newPos.x,
          y: newPos.y,
          width: PLAYER_SIZE / 3.22,
          height: PLAYER_SIZE,
        };

        const truckRect = {
          x: truckPos.x,
          y: truckPos.y,
          width: TRUCK_SIZE / 2.4,
          height: TRUCK_SIZE,
        };

        if (checkCollision(playerRect, truckRect)) {
          return prev; // Prevent movement into truck
        }

        return newPos;
      });
    };

    const interval = setInterval(movePlayer, 16);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    gameOver,
    showMinigameDone,
    handleKeyDown,
    handleKeyUp,
    gameStarted,
    showPauseMenu,
  ]);
  // Generate packages
  useEffect(() => {
    if (
      gameOver ||
      showMinigameDone ||
      packages.length >= MAX_PACKAGES ||
      !gameStarted ||
      showPauseMenu
    )
      return;

    const spawnPackage = () => {
      const newPackage = {
        id: Date.now(),
        x: Math.random() * (GAME_WIDTH - 100) + 50,
        y: Math.random() * (GAME_HEIGHT - 100) + 50,
      };
      setPackages((prev) => [...prev, newPackage]);
    };

    const packageInterval = setInterval(spawnPackage, 3000);
    return () => clearInterval(packageInterval);
  }, [packages.length, gameOver, showMinigameDone, gameStarted, showPauseMenu]);

  // Check collisions
  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted || showPauseMenu) return;

    // Check package pickup
    if (!carryingPackage) {
      packages.forEach((pkg) => {
        const distance = Math.hypot(playerPos.x - pkg.x, playerPos.y - pkg.y);

        if (distance < PLAYER_SIZE / 2 + PACKAGE_SIZE / 2) {
          setCarryingPackage(true);
          setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
        }
      });
    }

    // Check truck delivery
    if (carryingPackage) {
      const truckDistance = Math.hypot(
        playerPos.x - truckPos.x,
        playerPos.y - truckPos.y
      );

      if (truckDistance < PLAYER_SIZE / 2 + TRUCK_SIZE / 2) {
        setScore((prev) => prev + 100);
        setCarryingPackage(false);
      }
    }
  }, [
    playerPos,
    packages,
    carryingPackage,
    gameOver,
    showMinigameDone,
    gameStarted,
    showPauseMenu,
  ]);

  // Timer
  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted || showPauseMenu) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setShowMinigameDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, showMinigameDone, gameStarted, showPauseMenu]);

  // Event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleNextScene = () => {
    navigate(`/scene/${currentScene.sceneId + 1}`);
  };

  const handleGameReset = () => {
    setPlayerPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setPackages([]);
    setCarryingPackage(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setShowMinigameDone(false);
  };

  return (
    <div className="minigame1__container">
      {!gameStarted ? (
        <div className="start-screen">
          <div className="instructions-container">
            <h2>Nakládání balíčků</h2>
            <div className="instructions-content">
              <div className="controls-section">
                <h3>Ovládání:</h3>
                <img src={arrowsIcon} alt="Arrow keys" className="arrows-img" />
              </div>
              <div className="objective-section">
                <h3>Cíl:</h3>
                <ul>
                  <li>Sbírej balíčky</li>
                  <li>Nalož balíčků do auta</li>
                  <li>Musíš do auta naložit 10 balíčků během jedné minuty</li>
                  <li>Pohyb pomocí šipek vlevo/vpravo/nahoru/dolů</li>
                </ul>
              </div>
            </div>
            <button
              className="start-button"
              onClick={() => setGameStarted(true)}
            >
              Zahájit minihru
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              backgroundImage: `url(${roadTexture})`,
            }}
            className="minigame1-game-window"
          >
            {/* Truck */}
            <div
              style={{
                position: "absolute",
                left: truckPos.x,
                top: truckPos.y,
                width: TRUCK_SIZE / 2.4,
                height: TRUCK_SIZE,
                backgroundImage: `url(${truckImage})`,
                backgroundSize: "contain",
                zIndex: 2,
              }}
            />

            {/* Player */}
            <div
              style={{
                left: playerPos.x,
                top: playerPos.y,
                width: PLAYER_SIZE / 3.22,
                height: PLAYER_SIZE,
                backgroundImage: `url(${playerImage})`,
                transform: `scaleX(${playerPos.x < GAME_WIDTH / 2 ? 1 : -1})`,
              }}
              className="minigame1-player"
            >
              {/* Package indicator */}
              {carryingPackage && (
                <div
                  style={{
                    width: PACKAGE_SIZE,
                    height: PACKAGE_SIZE,
                    backgroundImage: `url(${packageImage})`,
                  }}
                  className="minigame1-carrying-package"
                />
              )}
            </div>

            {/* Packages */}
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  left: pkg.x,
                  top: pkg.y,
                  width: PACKAGE_SIZE,
                  height: PACKAGE_SIZE,
                  backgroundImage: `url(${packageImage})`,
                }}
                className="minigame1-package"
              />
            ))}

            {/* Game Info */}
            <div className="minigame1-game-info">
              <div>
                Čas: <strong>{timeLeft}s</strong>
              </div>
              <div>
                Celkové skóre: <strong>{score}</strong>
              </div>
            </div>

            {/* Completion Screen */}
            {showMinigameDone && (
              <div className="minigame1-done-screen">
                <h2>Čas vypršel</h2>
                <p>Celkové skóre {score}</p>
                <button
                  onClick={score > 1000 ? handleNextScene : handleGameReset}
                  className="start-button"
                >
                  {score > 1000 ? "Pokračovat" : "Nepovedlo se, zkus to znovu"}
                </button>
              </div>
            )}
            {/* Mobile Controls */}
            <div className="mobile-controls">
              <div className="d-pad">
                <button
                  className="control-btn up"
                  onTouchStart={() => pressedKeys.current.add("ArrowUp")}
                  onTouchEnd={() => pressedKeys.current.delete("ArrowUp")}
                >
                  &#x2191;
                </button>
                <button
                  className="control-btn down"
                  onTouchStart={() => pressedKeys.current.add("ArrowDown")}
                  onTouchEnd={() => pressedKeys.current.delete("ArrowDown")}
                >
                  &#x2193;
                </button>
                <button
                  className="control-btn left"
                  onTouchStart={() => pressedKeys.current.add("ArrowLeft")}
                  onTouchEnd={() => pressedKeys.current.delete("ArrowLeft")}
                >
                  &#x2190;
                </button>
                <button
                  className="control-btn right"
                  onTouchStart={() => pressedKeys.current.add("ArrowRight")}
                  onTouchEnd={() => pressedKeys.current.delete("ArrowRight")}
                >
                  &#x2192;
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
