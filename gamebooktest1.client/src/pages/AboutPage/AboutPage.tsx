import { NavLink, Outlet } from "react-router-dom";
import "./AboutStyles.css";

export const AboutPage = () => {
  return (
    <>
      <header className="retro-nav">
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Hrát hru
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about/story"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Příběh
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about/characters"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Hlavní postavy
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about/creators"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                O tvůrcích
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about/controls"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Ovládání
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
    </>
  );
};
