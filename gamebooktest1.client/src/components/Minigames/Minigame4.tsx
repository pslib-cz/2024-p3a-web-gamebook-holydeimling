import { useState, useEffect, useCallback, useRef } from "react";
import { Scene } from "../../types";
import { useNavigate } from "react-router-dom";
import "./Minigame4.css";

// Game constants
const GAME_CONFIG = {
  TOTAL_ENEMIES_NEEDED: 5,
  TIME_PER_ENEMY_MS: 1000, // 1 second to kill each enemy
  SPAWN_DELAY_MIN: 1000, // 1 second minimum between spawns
  SPAWN_DELAY_MAX: 5000, // 5 seconds maximum between spawns
  STARTING_ENEMY_HEALTH: 3,
  ENEMY_SPAWN_X_MIN: 30, // Minimum X position percentage
  ENEMY_SPAWN_X_MAX: 70, // Maximum X position percentage
  ENEMY_SPAWN_Y_MIN: 20, // Minimum Y position percentage
  ENEMY_SPAWN_Y_MAX: 80, // Maximum Y position percentage
};

interface Enemy {
  id: number;
  position: { x: number; y: number };
  health: number;
  spawnTime: number;
}

type Minigame4Props = {
  currentScene: Scene;
  showPauseMenu: boolean;
};

export const Minigame4 = ({ currentScene, showPauseMenu }: Minigame4Props) => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const spawnTimeout = useRef<NodeJS.Timeout>();
  const enemyRef = useRef<HTMLDivElement>(null);

  const spawnEnemy = useCallback(() => {
    const newEnemy: Enemy = {
      id: Date.now(),
      position: {
        x:
          GAME_CONFIG.ENEMY_SPAWN_X_MIN +
          Math.random() *
            (GAME_CONFIG.ENEMY_SPAWN_X_MAX - GAME_CONFIG.ENEMY_SPAWN_X_MIN),
        y:
          GAME_CONFIG.ENEMY_SPAWN_Y_MIN +
          Math.random() *
            (GAME_CONFIG.ENEMY_SPAWN_Y_MAX - GAME_CONFIG.ENEMY_SPAWN_Y_MIN),
      },
      health: GAME_CONFIG.STARTING_ENEMY_HEALTH,
      spawnTime: Date.now(),
    };
    setEnemies([newEnemy]);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setEnemies([]);
    spawnEnemy();
  };

  const handleEnemyClick = (enemyId: number, isHeadshot: boolean) => {
    if (gameOver || !enemies.length || showPauseMenu) return;

    setEnemies((prev) => {
      const updated = prev
        .map((enemy) => {
          if (enemy.id === enemyId) {
            const newHealth = isHeadshot ? 0 : enemy.health - 1;
            if (newHealth <= 0) {
              setScore(score + 1);
              return null;
            }
            return { ...enemy, health: newHealth };
          }
          return enemy;
        })
        .filter(Boolean) as Enemy[];

      // Schedule next spawn only when enemy is killed
      if (
        updated.length === 0 &&
        score + 1 < GAME_CONFIG.TOTAL_ENEMIES_NEEDED
      ) {
        const spawnDelay =
          GAME_CONFIG.SPAWN_DELAY_MIN +
          Math.random() *
            (GAME_CONFIG.SPAWN_DELAY_MAX - GAME_CONFIG.SPAWN_DELAY_MIN);

        spawnTimeout.current = setTimeout(spawnEnemy, spawnDelay);
      }

      return updated;
    });
  };

  useEffect(() => {
    if (!gameStarted || gameOver || showPauseMenu) return;

    const checkEnemyTimeout = () => {
      if (enemies.length > 0) {
        const enemy = enemies[0];
        if (Date.now() - enemy.spawnTime > GAME_CONFIG.TIME_PER_ENEMY_MS) {
          setGameOver(true);
        }
      }
    };

    const interval = setInterval(checkEnemyTimeout, 50);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, enemies, showPauseMenu]);

  useEffect(() => {
    if (score >= GAME_CONFIG.TOTAL_ENEMIES_NEEDED) {
      setEnemies([]);
      if (spawnTimeout.current) clearTimeout(spawnTimeout.current);
    }
  }, [score]);

  const handleNextScene = () => {
    navigate(`/scene/${currentScene.sceneId + 1}`);
  };

  return (
    <div className="minigame4-container">
      {!gameStarted ? (
        <div className="start-screen">
          <div className="instructions">
            <h2>Precision Shooter</h2>
            <div className="instructions-content">
              <h3>Rules:</h3>
              <ul>
                <li>🔫 Click heads for instant kills</li>
                <li>
                  🎯 {GAME_CONFIG.STARTING_ENEMY_HEALTH} body shots needed to
                  eliminate
                </li>
                <li>
                  ⏱️ Kill enemies within{" "}
                  {(GAME_CONFIG.TIME_PER_ENEMY_MS / 1000).toFixed(0)} seconds
                </li>
                <li>
                  🎯 Eliminate {GAME_CONFIG.TOTAL_ENEMIES_NEEDED} enemies to win
                </li>
              </ul>
              <button className="start-button" onClick={startGame}>
                Start Mission
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-screen">
          <div
            className="background"
            style={{ backgroundImage: "url('placeholder-background.jpg')" }}
          >
            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                ref={enemyRef}
                className="enemy"
                style={{
                  left: `${enemy.position.x}%`,
                  top: `${enemy.position.y}%`,
                  animation: `appear 0.3s ease-out`,
                }}
              >
                <div
                  className="enemy-head"
                  onClick={() => handleEnemyClick(enemy.id, true)}
                />
                <div
                  className="enemy-body"
                  onClick={() => handleEnemyClick(enemy.id, false)}
                />
                <div className="health-bar">
                  {[...Array(enemy.health)].map((_, i) => (
                    <div key={i} className="health-segment" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hud">
            <div className="hud-item">
              Kills: {score}/{GAME_CONFIG.TOTAL_ENEMIES_NEEDED}
            </div>
            <div className="hud-item">
              Time Left:{" "}
              {enemies.length > 0
                ? (
                    (GAME_CONFIG.TIME_PER_ENEMY_MS -
                      (Date.now() - enemies[0].spawnTime)) /
                    1000
                  ).toFixed(1)
                : "0.0"}
              s
            </div>
          </div>

          {gameOver && (
            <div className="game-over-screen">
              <h2>MISSION FAILED</h2>
              <button className="retry-button" onClick={startGame}>
                Retry
              </button>
            </div>
          )}

          {score >= GAME_CONFIG.TOTAL_ENEMIES_NEEDED && (
            <div className="victory-screen">
              <h2>MISSION COMPLETE!</h2>
              <button className="continue-button" onClick={handleNextScene}>
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
