import React, { useState, useEffect, useCallback, useRef } from "react";
import carEnemyImage from "../../assets/Mini/carEnemy.png";
import { Scene } from "../../types";
import { useNavigate } from "react-router-dom";
import carPlayer from "../../assets/Mini/carPlayer.png";
import arrowsIcon from "../../assets/arrowsIcon.png";
import "./Minigame2.css";

interface ObstacleType {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
}

type Minigame2Props = {
  currentScene: Scene;
};

export const Minigame2 = ({ currentScene }: Minigame2Props) => {
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;
  const LANE_WIDTH = GAME_WIDTH / 3;
  const CAR_SIZE = 60;
  const POINTS_TO_WIN = 7500;

  // Move ALL hooks to the top level, before any conditionals
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLane, setCurrentLane] = useState(1);
  const [rotation, setRotation] = useState<number>(0);
  const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showMinigameDone, setShowMinigameDone] = useState<boolean>(false);

  const navigate = useNavigate();
  const pressedKeys = useRef<Set<string>>(new Set());

  const carX = LANE_WIDTH * (currentLane + 0.5) - CAR_SIZE / 2;

  // Discrete lane movement
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || showMinigameDone) return;

      if (e.key === "ArrowLeft") {
        setCurrentLane((prev) => Math.max(0, prev - 1));
        setRotation(-15);
        setTimeout(() => setRotation(0), 200);
      } else if (e.key === "ArrowRight") {
        setCurrentLane((prev) => Math.min(2, prev + 1));
        setRotation(15);
        setTimeout(() => setRotation(0), 200);
      }
    },
    [gameStarted, gameOver, showMinigameDone]
  );

  // Event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleMobileMove = (direction: "left" | "right") => {
    if (!gameStarted || gameOver || showMinigameDone) return;

    const newLane =
      direction === "left"
        ? Math.max(0, currentLane - 1)
        : Math.min(2, currentLane + 1);

    setCurrentLane(newLane);
    setRotation(direction === "left" ? -15 : 15);
    setTimeout(() => setRotation(0), 200);
  };

  const handleTouchStart = (direction: "left" | "right") => {
    pressedKeys.current.add(direction === "left" ? "ArrowLeft" : "ArrowRight");
    handleMobileMove(direction);
  };

  const handleTouchEnd = (direction: "left" | "right") => {
    pressedKeys.current.delete(
      direction === "left" ? "ArrowLeft" : "ArrowRight"
    );
  };

  useEffect(() => {
    if (!gameStarted || gameOver || showMinigameDone) return;

    const mobileGameLoop = setInterval(() => {
      if (pressedKeys.current.has("ArrowLeft")) {
        handleMobileMove("left");
      }
      if (pressedKeys.current.has("ArrowRight")) {
        handleMobileMove("right");
      }
    }, 100);

    return () => clearInterval(mobileGameLoop);
  }, [gameStarted, gameOver, showMinigameDone, currentLane]);

  // Generate obstacles
  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted) return;

    const obstacleInterval = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      const newObstacle: ObstacleType = {
        id: Date.now(),
        x: LANE_WIDTH * (lane + 0.5) - 40, // Center in lane
        y: -100,
        width: 80,
        height: 160,
        image: carEnemyImage,
      };

      setObstacles((prev) => [...prev, newObstacle]);
    }, 1000);

    return () => clearInterval(obstacleInterval);
  }, [gameOver, showMinigameDone, gameStarted]);

  // Collision detection
  const checkCollision = (rect1: Rect, rect2: Rect): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  // Game loop
  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted) return;

    const gameLoop = setInterval(() => {
      setObstacles((prev) =>
        prev
          .filter((obs) => {
            const carRect: Rect = {
              x: carX,
              y: GAME_HEIGHT - 150,
              width: CAR_SIZE,
              height: CAR_SIZE * 2,
              image: carPlayer,
            };

            const obsRect: Rect = {
              x: obs.x,
              y: obs.y,
              width: obs.width,
              height: obs.height,
              image: obs.image,
            };

            if (checkCollision(carRect, obsRect)) {
              setGameOver(true);
            }
            return obs.y < GAME_HEIGHT + 100;
          })
          .map((obs) => ({ ...obs, y: obs.y + 5 }))
      );

      setScore((prev) => prev + 1);
    }, 10);

    return () => clearInterval(gameLoop);
  }, [carX, gameOver, showMinigameDone, gameStarted]);

  // Rest of the code remains the same...
  // [Keep the restartGame, useEffect for score, and rendering parts unchanged]

  const restartGame = () => {
    setRotation(0);
    setObstacles([]);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (score >= POINTS_TO_WIN) {
      setShowMinigameDone(true);
    }
  }, [score]);

  const handleNextScene = () => {
    navigate(`/scene/${currentScene.sceneId + 1}`);
  };
  return (
    <div className="minigame2__container">
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
                  <li>Reach {POINTS_TO_WIN} points to win</li>
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
        <>
          {" "}
          <div
            className="game-container"
            style={{
              position: "relative",
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              margin: "auto",
              backgroundColor: "#333",
              overflow: "hidden",
            }}
          >
            {/* Road lanes */}
            <div
              style={{
                position: "absolute",
                left: LANE_WIDTH,
                width: 2,
                height: "100%",
                backgroundColor: "white",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: LANE_WIDTH * 2,
                width: 2,
                height: "100%",
                backgroundColor: "white",
              }}
            />

            {/* Car - now positioned at bottom */}
            <div
              style={{
                position: "absolute",
                left: carX,
                top: GAME_HEIGHT - 150,
                width: CAR_SIZE,
                height: CAR_SIZE * 2,
                backgroundImage: `url(${carPlayer})`,
                backgroundSize: "cover",
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.3s, left 0.3s",
              }}
            />

            {/* Obstacles */}
            {obstacles.map((obs) => (
              <div
                key={obs.id}
                style={{
                  position: "absolute",
                  left: obs.x,
                  top: obs.y,
                  width: obs.width,
                  height: obs.height,
                  backgroundImage: `url(${obs.image})`,
                  backgroundSize: "cover",
                }}
              />
            ))}

            {/* Fixed mobile controls */}
            <div className="mobile-controls">
              <button
                className="control-btn left"
                onTouchStart={() => handleTouchStart("left")}
                onTouchEnd={() => handleTouchEnd("left")}
              >
                ←
              </button>
              <button
                className="control-btn right"
                onTouchStart={() => handleTouchStart("right")}
                onTouchEnd={() => handleTouchEnd("right")}
              >
                →
              </button>
            </div>

            {/* Game Over Screen */}
            {gameOver && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <h2>Game Over!</h2>
                <p>Score: {score}</p>
                <button
                  onClick={restartGame}
                  style={{ padding: "10px 20px", fontSize: "1.2rem" }}
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Score Display */}
            {!gameOver && (
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  color: "white",
                  fontSize: "1.5rem",
                }}
              >
                Score: {score}
              </div>
            )}
          </div>
          {showMinigameDone && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "white",
              }}
            >
              <h2>Vyhrál jsi :)</h2>
              <button
                onClick={handleNextScene}
                style={{ padding: "10px 20px", fontSize: "1.2rem" }}
              >
                Pokračovat
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
