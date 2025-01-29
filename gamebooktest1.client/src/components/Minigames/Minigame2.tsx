import React, { useState, useEffect, useCallback } from "react";
import carEnemyImage from "../../assets/Mini/carEnemy.png";
import { Scene } from "../../types";
import { useNavigate } from "react-router-dom";
import carPlayer from "../../assets/Mini/carPlayer.png";

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

  const [carX, setCarX] = useState<number>(
    LANE_WIDTH + (LANE_WIDTH / 2 - CAR_SIZE / 2)
  );
  const [rotation, setRotation] = useState<number>(0);
  const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const [showMinigameDone, setShowMinigameDone] = useState<boolean>(false);

  const navigate = useNavigate();

  // Car movement between lanes
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || showMinigameDone) return;

      const moveAmount = LANE_WIDTH;
      setRotation(0);

      if (e.key === "ArrowLeft") {
        setCarX((prevX) =>
          Math.max(LANE_WIDTH / 2 - CAR_SIZE / 2, prevX - moveAmount)
        );
        setRotation(-15);
      } else if (e.key === "ArrowRight") {
        setCarX((prevX) =>
          Math.min(LANE_WIDTH * 2.5 - CAR_SIZE / 2, prevX + moveAmount)
        );
        setRotation(15);
      }
    },
    [gameOver, showMinigameDone]
  );

  // Generate obstacles
  useEffect(() => {
    if (gameOver || showMinigameDone) return;

    const obstacleInterval = setInterval(() => {
      const lane =
        Math.floor(Math.random() * 3) * LANE_WIDTH + (LANE_WIDTH / 2 - 40);
      const newObstacle: ObstacleType = {
        id: Date.now(),
        x: lane,
        y: -100,
        width: 80,
        height: 160,
        image: carEnemyImage,
      };

      setObstacles((prev) => [...prev, newObstacle]);
    }, 1500);

    return () => clearInterval(obstacleInterval);
  }, [gameOver, showMinigameDone]);

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
    if (gameOver || showMinigameDone) return;

    const gameLoop = setInterval(() => {
      setObstacles((prev) =>
        prev
          .filter((obs) => {
            const carRect: Rect = {
              x: carX,
              y: GAME_HEIGHT - 150, // Fixed vertical position at bottom
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
  }, [carX, gameOver, showMinigameDone]);

  // Event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const restartGame = () => {
    setCarX(LANE_WIDTH + (LANE_WIDTH / 2 - CAR_SIZE / 2));
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
    </div>
  );
};
