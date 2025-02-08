import React, { useState, useEffect, useCallback, useRef } from "react";
import carEnemyImage from "../../assets/Mini/carEnemy.png";
import { Scene } from "../../types";
import { useNavigate } from "react-router-dom";
import carPlayer from "../../assets/Mini/carPlayer.png";
import arrowsIcon from "../../assets/arrowsIcon.png";
import "./Minigame2.css";
import roadTexture from "../../assets/Mini/road.jpg";

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
  showPauseMenu: boolean;
};

export const Minigame2 = ({ currentScene, showPauseMenu }: Minigame2Props) => {
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;
  const LANE_WIDTH = GAME_WIDTH / 3;
  const CAR_SIZE = 70;
  const POINTS_TO_WIN = 7500;

  const [gameStarted, setGameStarted] = useState(false);
  const [currentLane, setCurrentLane] = useState(1);
  const [rotation, setRotation] = useState<number>(0);
  const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showMinigameDone, setShowMinigameDone] = useState<boolean>(false);
  const [carY, setCarY] = useState<number>(GAME_HEIGHT - 300);

  const navigate = useNavigate();
  const pressedKeys = useRef<Set<string>>(new Set());

  const carX = LANE_WIDTH * (currentLane + 0.5) - CAR_SIZE / 2;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || showMinigameDone || showPauseMenu) return;

      switch (e.key) {
        case "ArrowLeft":
          setCurrentLane((prev) => Math.max(0, prev - 1));
          setRotation(-15);
          setTimeout(() => setRotation(0), 200);
          break;
        case "ArrowRight":
          setCurrentLane((prev) => Math.min(2, prev + 1));
          setRotation(15);
          setTimeout(() => setRotation(0), 200);
          break;
        case "ArrowUp":
          setCarY((prev) => Math.max(0, prev - 10));
          break;
        case "ArrowDown":
          setCarY((prev) => Math.min(GAME_HEIGHT - 300, prev + 10));
          break;
      }
    },
    [gameStarted, gameOver, showMinigameDone, showPauseMenu, GAME_HEIGHT]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleMobileMove = (direction: "left" | "right") => {
    if (!gameStarted || gameOver || showMinigameDone || showPauseMenu) return;

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
  }, [gameStarted, gameOver, showMinigameDone, currentLane, showPauseMenu]);

  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted || showPauseMenu) return;

    const obstacleInterval = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      const newObstacle: ObstacleType = {
        id: Date.now(),
        x: (GAME_WIDTH / 3) * lane + GAME_WIDTH / 6 - 40,
        y: -100,
        width: 80,
        height: 190,
        image: carEnemyImage,
      };

      setObstacles((prev) => [...prev, newObstacle]);
    }, 1000);

    return () => clearInterval(obstacleInterval);
  }, [gameOver, showMinigameDone, gameStarted, showPauseMenu]);

  const checkCollision = (rect1: Rect, rect2: Rect): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  useEffect(() => {
    if (gameOver || showMinigameDone || !gameStarted || showPauseMenu) return;

    const gameLoop = setInterval(() => {
      setObstacles((prev) =>
        prev
          .filter((obs) => {
            const carRect: Rect = {
              x: carX,
              y: carY,
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
  }, [
    carX,
    carY,
    gameOver,
    showMinigameDone,
    gameStarted,
    showPauseMenu,
    GAME_HEIGHT,
  ]);

  const restartGame = () => {
    setRotation(0);
    setObstacles([]);
    setGameOver(false);
    setScore(0);
    setCarY(GAME_HEIGHT - 300);
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
            <h2>Vyhýbání se autům</h2>
            <div className="instructions-content">
              <div className="controls-section">
                <h3>Ovládání:</h3>
                <img src={arrowsIcon} alt="Arrow keys" className="arrows-img" />
                <p>Použij šipky pro pohyb a vyhýbání se</p>
              </div>
              <div className="objective-section">
                <h3>Cíl:</h3>
                <ul>
                  <li>Vyhíbej se autům</li>
                  <li>Musíš nasbírat {POINTS_TO_WIN} bodů pro výhru</li>
                  <li>Změna jízdního pruhu pomocí šipek vlevo a vpravo</li>
                  <li>Pohyb nahoru/dolů pomocí šipek ↑↓</li>
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
            className="minigame2-game-container"
            style={{
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              backgroundImage: `url(${roadTexture})`,
            }}
          >
            <div style={{ left: LANE_WIDTH - 5 }} className="minigame2-lane" />
            <div style={{ left: LANE_WIDTH + 5 }} className="minigame2-lane" />
            <div
              style={{ left: LANE_WIDTH * 2 - 5 }}
              className="minigame2-lane"
            />
            <div
              style={{ left: LANE_WIDTH * 2 + 5 }}
              className="minigame2-lane"
            />

            <div
              style={{
                left: carX,
                top: carY,
                width: CAR_SIZE,
                height: CAR_SIZE * 2 + 30,
                backgroundImage: `url(${carPlayer})`,
                transform: `rotate(${rotation}deg)`,
              }}
              className="minigame2-car-player"
            />

            {obstacles.map((obs) => (
              <div
                key={obs.id}
                style={{
                  left: obs.x,
                  top: obs.y,
                  width: obs.width,
                  height: obs.height,
                  backgroundImage: `url(${obs.image})`,
                }}
                className="minigame2-car-enemy"
              />
            ))}

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

            {gameOver && (
              <div className="game-over-screen">
                <h2>Naboural jsi!</h2>
                <p>
                  Dosažené skóre: <strong>{score}</strong>
                </p>
                <button onClick={restartGame} className="start-button">
                  Zkusit znovu
                </button>
              </div>
            )}

            {!gameOver && (
              <div className="score-display">
                Skóre: <strong>{score}</strong>
              </div>
            )}
          </div>
          {showMinigameDone && (
            <div className="minigame-complete-screen">
              <h2>Vyhrál jsi :)</h2>
              <button onClick={handleNextScene} className="start-button">
                Pokračovat
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
