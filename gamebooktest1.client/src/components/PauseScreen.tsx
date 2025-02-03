import { useUser } from "../UserContext";
import { HomeScreenButton } from "./Home/HomeScreenButton";
import "./PauseScreen.css";

type PauseScreenProps = {
  handleResume: () => void;
  handleExitToMainMenu: () => void;
};

export const PauseScreen = ({
  handleResume,
  handleExitToMainMenu,
}: PauseScreenProps) => {
  const { user } = useUser();
  return (
    <div className="pause-screen__container">
      <h1>
        {user
          ? `Tvůj postup ve hře bude uložen do poslední uložené scény. Scéna: ${user?.gameState.checkpointSceneId}`
          : `Tvůj postup ve hře bude ztracen.`}
      </h1>
      <HomeScreenButton text="Pokračovat" onClick={handleResume} />
      <HomeScreenButton text="Odejít" onClick={handleExitToMainMenu} />
    </div>
  );
};
