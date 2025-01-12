import { useUser } from "../UserContext";
import { HomeScreenButton } from "./Home/HomeScreenButton";

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
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h1>
        {user
          ? `Tvůj postup ve hře bude uložen do poslední úspěšné scény. Scéna: ${user?.gameState.checkpointSceneId}`
          : `Tvůj postup ve hře bude ztracen.`}
      </h1>
      <HomeScreenButton text="Pokračovat" onClick={handleResume} />
      <HomeScreenButton text="Odejít" onClick={handleExitToMainMenu} />
    </div>
  );
};
