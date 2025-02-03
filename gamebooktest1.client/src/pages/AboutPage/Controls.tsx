import { Link } from "react-router-dom";
import "./StoryPage.css";

export const ControlsPage = () => {
  return (
    <div className="story-page">
      <h1>Ovládání</h1>
      <p>Hra se ovládá velice jednodušše.</p>
      <p>
        Většinový průchod hry závisí na scénách. V každé scéně je několik
        zajímavých dialogů s ruznými postavami tudíž se nikdy nebudete nudit.
      </p>
      <br />
      <p>
        Taktéž se ve hře nacházejí minihry. Vždy před jejich začátkem si stačí
        přečíst dialog uvádející celou minihru.
      </p>
      <br />
      <p>Hodně štěstí ve vašem dobrodružství.</p>
      <br />
      <Link to="/">Zahájit hru.</Link>
    </div>
  );
};
