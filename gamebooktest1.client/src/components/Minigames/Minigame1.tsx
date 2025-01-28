import React, { useState, useEffect, useCallback } from "react";
import packageImage from "../../assets/Mini/cartonBox.png"; //upravit cesty jakmile obrazek
import { Scene } from "../../types";
import { useNavigate } from "react-router-dom";
import truckImage from "../../assets/Mini/carPlayer.png"; //upravit cesty jakmile obrazek
import playerImage from "../../assets/Mini/testMainCharacter.png"; //upravit cesty jakmile obrazek
import roadTexture from "../../assets/Mini/road.jpg";

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

export const Minigame1 = ({ currentScene }: MinigameTruckProps) => {
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;
  const PLAYER_SIZE = 200;
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
  const [packages, setPackages] = useState<Package[]>([]);
  const [carryingPackage, setCarryingPackage] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showMinigameDone, setShowMinigameDone] = useState<boolean>(false);

  const navigate = useNavigate();

  const pressedKeys = new Set<string>();

  // Player movement
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || showMinigameDone) return;
      pressedKeys.add(e.key);
    },
    [gameOver, showMinigameDone]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    pressedKeys.delete(e.key);
  }, []);

  useEffect(() => {
    const movePlayer = () => {
      if (gameOver || showMinigameDone) return;

      setPlayerPos((prev) => {
        const newPos = { ...prev };
        if (pressedKeys.has("ArrowUp")) {
          newPos.y = Math.max(0, prev.y - MOVE_SPEED);
        }
        if (pressedKeys.has("ArrowDown")) {
          newPos.y = Math.min(GAME_HEIGHT - PLAYER_SIZE, prev.y + MOVE_SPEED);
        }
        if (pressedKeys.has("ArrowLeft")) {
          newPos.x = Math.max(0, prev.x - MOVE_SPEED);
        }
        if (pressedKeys.has("ArrowRight")) {
          newPos.x = Math.min(GAME_WIDTH - PLAYER_SIZE, prev.x + MOVE_SPEED);
        }
        return newPos;
      });
    };

    const interval = setInterval(movePlayer, 16); // Update player position every 16ms

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, showMinigameDone, handleKeyDown, handleKeyUp]);

  // Generate packages
  useEffect(() => {
    if (gameOver || showMinigameDone || packages.length >= MAX_PACKAGES) return;

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
  }, [packages.length, gameOver, showMinigameDone]);

  // Check collisions
  useEffect(() => {
    if (gameOver || showMinigameDone) return;

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
  }, [playerPos, packages, carryingPackage, gameOver, showMinigameDone]);

  // Timer
  useEffect(() => {
    if (gameOver || showMinigameDone) return;

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
  }, [gameOver, showMinigameDone]);

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
    <div className="minigame1__containe">
      <div
        style={{
          position: "relative",
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: "#33333",
          overflow: "hidden",
          backgroundImage: `url(${roadTexture})`,
        }}
      >
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
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            backgroundImage: `url(${playerImage})`,
            backgroundSize: "contain",
            transform: `scaleX(${playerPos.x < GAME_WIDTH / 2 ? 1 : -1})`,
            transition: "left 0.1s, top 0.1s",
            zIndex: 1,
          }}
        >
          {/* Package indicator */}
          {carryingPackage && (
            <div
              style={{
                position: "absolute",
                top: -15,
                right: -10,
                width: 40,
                height: 40,
                backgroundImage: `url(${packageImage})`,
                backgroundSize: "contain",
              }}
            />
          )}
        </div>

        {/* Packages */}
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            style={{
              position: "absolute",
              left: pkg.x,
              top: pkg.y,
              width: PACKAGE_SIZE,
              height: PACKAGE_SIZE,
              backgroundImage: `url(${packageImage})`,
              backgroundSize: "contain",
            }}
          />
        ))}

        {/* Game Info */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            padding: "10px",
            borderRadius: "5px",
            display: "flex",
            gap: "20px",
            backgroundColor: "white",
          }}
        >
          <div>Time: {timeLeft}s</div>
          <div>Score: {score}</div>
        </div>

        {/* Completion Screen */}
        {showMinigameDone && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: "2rem",
              borderRadius: "10px",
              color: "white",
              textAlign: "center",
            }}
          >
            <h2>Time's Up!</h2>
            <p>Final Score: {score}</p>
            <button
              onClick={score > 1000 ? handleNextScene : handleGameReset}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                marginTop: "1rem",
                backgroundColor: "#4CAF50",
                border: "none",
                borderRadius: "5px",
                color: "white",
              }}
            >
              {score > 1000 ? "Pokračovat" : "Nepovedlo se, zkus to znovu"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
