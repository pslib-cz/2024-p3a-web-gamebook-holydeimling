import React, { useState, useEffect, useCallback, useRef } from "react";
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
};

export const Minigame3 = ({ currentScene }: MinigameTruckProps) => {
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
    // Initialize packages
    const initialPackages = Array.from({ length: MAX_PACKAGES }, (_, i) => ({
      id: i,
      x: truckPos.x + TRUCK_SIZE / 2 - PACKAGE_SIZE / 2,
      y: truckPos.y + TRUCK_SIZE / 2 - PACKAGE_SIZE / 2,
    }));

    setPackages(initialPackages);
  }, []);

  // Player movement
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || showMinigameDone || !gameStarted) return;
      pressedKeys.current.add(e.key);
    },
    [gameOver, showMinigameDone, gameStarted]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    pressedKeys.current.delete(e.key);
  }, []);

  useEffect(() => {
    const movePlayer = () => {
      if (gameOver || showMinigameDone || !gameStarted) return;

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
  }, [gameOver, showMinigameDone, handleKeyDown, handleKeyUp, gameStarted]);

  // Game logic
  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted) return;

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
  ]);

  // Timer
  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted) return;

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
  }, [gameOver, showMinigameDone, gameStarted]);

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
            <h2>Highway Challenge</h2>
            <div className="instructions-content">
              <div className="controls-section">
                <h3>Controls:</h3>
                <img src={arrowsIcon} alt="Arrow keys" className="arrows-img" />
                <div className="mobile-controls-preview">
                  <button className="control-btn demo">←</button>
                  <button className="control-btn demo">→</button>
                </div>
              </div>
              <div className="objective-section">
                <h3>Objective:</h3>
                <ul>
                  <li>Avoid incoming cars</li>
                  <li>Reach {"kys"} points to win</li>
                  <li>Use left/right arrows to change lanes</li>
                </ul>
              </div>
            </div>
            <button
              className="start-button"
              onClick={() => setGameStarted(true)}
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: "#333",
            overflow: "hidden",
            backgroundImage: `url(${roadTexture})`,
          }}
        >
          {/* River area on the right */}
          <div
            className="river-area"
            style={{
              position: "absolute",
              right: 0,
              width: RIVER_WIDTH,
              height: "100%",
            }}
          >
            <div className="water-overlay" />
          </div>

          {/* Truck */}
          <div
            style={{
              position: "absolute",
              left: truckPos.x,
              top: truckPos.y,
              width: TRUCK_SIZE,
              height: TRUCK_SIZE,
              backgroundImage: `url(${truckImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              zIndex: 2,
            }}
          />

          {/* Player */}
          <div
            style={{
              position: "absolute",
              left: playerPos.x,
              top: playerPos.y,
              width: PLAYER_SIZE / 3.22,
              height: PLAYER_SIZE,
              backgroundImage: `url(${playerImage})`,
              backgroundSize: "contain",
              transform: `scaleX(${playerPos.x < GAME_WIDTH / 2 ? 1 : -1})`,
              transition: "left 0.1s, top 0.1s",
              zIndex: 1,
            }}
          >
            {carryingPackage && (
              <div
                style={{
                  position: "absolute",
                  top: 60,
                  right: 55,
                  width: PACKAGE_SIZE,
                  height: PACKAGE_SIZE,
                  backgroundImage: `url(${barelImage})`,
                  backgroundSize: "contain",
                }}
              />
            )}
          </div>

          {/* Packages on truck */}
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                position: "absolute",
                left: pkg.x,
                top: pkg.y,
                width: PACKAGE_SIZE,
                height: PACKAGE_SIZE,
                backgroundImage: `url(${barelImage})`,
                backgroundSize: "contain",
              }}
            />
          ))}

          {/* Game Info */}
          <div className="game-info">
            <div>Time: {timeLeft}s</div>
            <div>Score: {score}</div>
            <div>
              Packages Left: {packages.length + (carryingPackage ? 1 : 0)}
            </div>
          </div>

          {/* Completion Screen */}
          {showMinigameDone && (
            <div className="completion-screen">
              <h2>{packages.length === 0 ? "Success!" : "Time's Up!"}</h2>
              <p>Final Score: {score}</p>
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
