import { useNavigate } from "react-router-dom";
import { User } from "../UserContext";
import { loadGame } from "../utils/startGame";
import "./GameOverScreen.css";
import { HomeScreenButton } from "./Home/HomeScreenButton";

type GameOverScreenProps = {
  setShowGameOver: (showGameOver: boolean) => void;
  user: User | null;
  setUser: (user: User) => void;
};

export const GameOverScreen = ({
  setShowGameOver,
  user,
  setUser,
}: GameOverScreenProps) => {
  const navigate = useNavigate();
  const handleGameOverScreen = () => {
    setShowGameOver(false);
    loadGame(user, setUser);
    navigate(`/scene/${user?.gameState.checkpointSceneId}`);
  };
  return (
    <div className="game-over__container">
      <h1>Game Over</h1>
      <HomeScreenButton
        onClick={handleGameOverScreen}
        text="Načíst poslední checkpoint"
      />
    </div>
  );
};
