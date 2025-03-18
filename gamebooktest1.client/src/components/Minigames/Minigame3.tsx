import { useState, useEffect, useCallback, useRef } from "react";
import barelImage from "../../assets/Mini/barel.png";
import { Scene } from "../../types";
import { useNavigate } from "react-router-dom";
import truckImage from "../../assets/Mini/carPlayer.png";
import playerImage from "../../assets/Mini/mainCharacter.png";
import roadTexture from "../../assets/Mini/road.jpg";
import "./Minigame3.css";
import arrowsIcon from "../../assets/arrowsIcon.png";

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

export const Minigame3 = ({
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
  const MAX_PACKAGES = 10;
  const RIVER_WIDTH = 150;

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
  const pressedKeys = useRef<Set<string>>(new Set());

  // Initialize game elements
  useEffect(() => {
    const initialPackages = Array.from({ length: MAX_PACKAGES }, (_, i) => ({
      id: i,
      x: truckPos.x + TRUCK_SIZE / 2 - PACKAGE_SIZE / 2,
      y: truckPos.y + TRUCK_SIZE / 2 - PACKAGE_SIZE / 2,
    }));
    setPackages(initialPackages);
  }, []);

  const checkCollision = (newPos: Position): boolean => {
    const playerWidth = PLAYER_SIZE / 3.22;

    // Player hitbox
    const playerLeft = newPos.x;
    const playerRight = newPos.x + playerWidth;
    const playerTop = newPos.y;
    const playerBottom = newPos.y + PLAYER_SIZE;

    // Truck hitbox
    const truckLeft = truckPos.x;
    const truckRight = truckPos.x + TRUCK_SIZE / 2 + 15;
    const truckTop = truckPos.y;
    const truckBottom = truckPos.y + TRUCK_SIZE;

    return (
      playerRight > truckLeft &&
      playerLeft < truckRight &&
      playerBottom > truckTop &&
      playerTop < truckBottom
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
        const moveAmount = MOVE_SPEED;

        if (pressedKeys.current.has("ArrowUp")) {
          newPos.y = Math.max(0, prev.y - moveAmount);
        }
        if (pressedKeys.current.has("ArrowDown")) {
          newPos.y = Math.min(GAME_HEIGHT - PLAYER_SIZE, prev.y + moveAmount);
        }
        if (pressedKeys.current.has("ArrowLeft")) {
          newPos.x = Math.max(0, prev.x - moveAmount);
        }
        if (pressedKeys.current.has("ArrowRight")) {
          newPos.x = Math.min(
            GAME_WIDTH - PLAYER_SIZE / 3.22 - RIVER_WIDTH,
            prev.x + moveAmount
          );
        }

        // Check collision before updating position
        if (checkCollision(newPos)) {
          return prev; // Return previous position if collision
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

  // Game logic
  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted || showPauseMenu) return;

    // Pick up package from truck
    if (!carryingPackage) {
      const truckDistance = Math.hypot(
        playerPos.x - truckPos.x,
        playerPos.y - truckPos.y
      );

      if (
        truckDistance < PLAYER_SIZE / 3.22 + TRUCK_SIZE / 2 &&
        packages.length > 0
      ) {
        setCarryingPackage(true);
        setPackages((prev) => prev.slice(0, -1));
      }
    }

    // Throw package to river (right side)
    if (
      carryingPackage &&
      playerPos.x >= GAME_WIDTH - RIVER_WIDTH - PLAYER_SIZE / 3.22
    ) {
      setCarryingPackage(false);
      setScore((prev) => prev + 100);
    }

    // Check win condition
    if (packages.length === 0 && !carryingPackage) {
      setGameOver(true);
      setShowMinigameDone(true);
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

  const handleNextScene = () => {
    navigate(`/scene/${currentScene.sceneId + 1}`);
  };

  const handleGameReset = () => {
    setPlayerPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setPackages(
      Array.from({ length: MAX_PACKAGES }, (_, i) => ({
        id: i,
        x: truckPos.x + TRUCK_SIZE / 2 - PACKAGE_SIZE / 2,
        y: truckPos.y + TRUCK_SIZE / 2 - PACKAGE_SIZE / 2,
      }))
    );
    setCarryingPackage(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setShowMinigameDone(false);
  };

  return (
    <div className="minigame3__container">
      {!gameStarted ? (
        <div className="start-screen">
          <div className="instructions-container">
            <h2>Zbavení se barelů</h2>
            <div className="instructions-content">
              <div className="controls-section">
                <h3>Ovládání:</h3>
                <img src={arrowsIcon} alt="Arrow keys" className="arrows-img" />
                <div className="mobile-controls-preview">
                  <button className="control-btn demo">←</button>
                  <button className="control-btn demo">→</button>
                </div>
              </div>
              <div className="objective-section">
                <h3>Cíl:</h3>
                <ul>
                  <li>Sbírej barely z auta</li>
                  <li>Po sebrání vhoď barel do řeky</li>
                  <li>Zahoď takto 10 barelů pro splnění </li>
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
        <div
          style={{
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundImage: `url(${roadTexture})`,
          }}
          className="minigame3-game"
        >
          {/* River area on the right */}
          <div
            className="river-area"
            style={{
              width: RIVER_WIDTH,
            }}
          >
            <div className="water-overlay" />
          </div>

          {/* Truck */}
          <div
            style={{
              left: truckPos.x,
              top: truckPos.y,
              width: TRUCK_SIZE,
              height: TRUCK_SIZE,
              backgroundImage: `url(${truckImage})`,
            }}
            className="minigame3-truck"
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
            className="minigame3-player"
          >
            {carryingPackage && (
              <div
                style={{
                  width: PACKAGE_SIZE,
                  height: PACKAGE_SIZE,
                  backgroundImage: `url(${barelImage})`,
                }}
                className="minigames3-carrying-barrel"
              />
            )}
          </div>

          {/* Packages on truck */}
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                left: pkg.x,
                top: pkg.y,
                width: PACKAGE_SIZE,
                height: PACKAGE_SIZE,
                backgroundImage: `url(${barelImage})`,
              }}
              className="minigame3-barrel"
            />
          ))}

          {/* Game Info */}
          <div className="game-info">
            <div>Čas: {timeLeft}s</div>
            <div>Celkové skóre: {score}</div>
            <div>
              Zbývající balíčky: {packages.length + (carryingPackage ? 1 : 0)}
            </div>
          </div>

          {/* Completion Screen */}
          {showMinigameDone && (
            <div className="completion-screen">
              <h2>{packages.length === 0 ? "Success!" : "Čas vypršel"}</h2>
              <p>Celkové skóre {score}</p>
              <button
                onClick={
                  packages.length === 0 ? handleNextScene : handleGameReset
                }
                className="restart-button"
              >
                {packages.length === 0 ? "Continue" : "Try Again"}
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
                ↑
              </button>
              <button
                className="control-btn down"
                onTouchStart={() => pressedKeys.current.add("ArrowDown")}
                onTouchEnd={() => pressedKeys.current.delete("ArrowDown")}
              >
                ↓
              </button>
              <button
                className="control-btn left"
                onTouchStart={() => pressedKeys.current.add("ArrowLeft")}
                onTouchEnd={() => pressedKeys.current.delete("ArrowLeft")}
              >
                ←
              </button>
              <button
                className="control-btn right"
                onTouchStart={() => pressedKeys.current.add("ArrowRight")}
                onTouchEnd={() => pressedKeys.current.delete("ArrowRight")}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
