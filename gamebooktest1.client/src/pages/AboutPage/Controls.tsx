import { Link } from "react-router-dom";
import "./AboutStyles.css";

export const ControlsPage = () => {
  return (
    <div className="retro-container">
      <h1 className="retro-title">Ovládání</h1>
      <div className="retro-controls">
        <p className="retro-text">Hra se ovládá velice jednodušše.</p>
        <p className="retro-text">
          Většinový průchod hry závisí na scénách. V každé scéně je několik
          zajímavých dialogů s ruznými postavami tudíž se nikdy nebudete nudit.
        </p>
        <br />
        <p className="retro-text">
          Taktéž se ve hře nacházejí minihry. Vždy před jejich začátkem si stačí
          přečíst dialog uvádející celou minihru.
        </p>
        <br />
        <p className="retro-text">Hodně štěstí ve vašem dobrodružství.</p>
      </div>
      <Link to="/" className="retro-link">
        Zahájit hru.
      </Link>
    </div>
  );
};
