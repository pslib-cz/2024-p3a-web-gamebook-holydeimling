import { useNavigate } from "react-router-dom";
import "./GameNoUserAlert.css";

type GameNoUserAlertProps = {
  setShowGameNoUserAlert: (value: boolean) => void;
};

export const GameNoUserAlert = ({
  setShowGameNoUserAlert,
}: GameNoUserAlertProps) => {
  const navigate = useNavigate();
  return (
    <div className="alert__container">
      <h1>Pro nejlepší zážitek ze hry se přihlašte</h1>
      <div className="in-game-menu__buttons">
        <button
          onClick={() => setShowGameNoUserAlert(false)}
          className="in-game-menu__button"
        >
          Pokračovat bez přihlášení
        </button>
        <button
          className="in-game-menu__button"
          onClick={() => navigate("/login")}
        >
          Přihlásit se
        </button>
        <button
          className="in-game-menu__button"
          onClick={() => navigate("/register")}
        >
          Nemám účet
        </button>
      </div>
    </div>
  );
};
