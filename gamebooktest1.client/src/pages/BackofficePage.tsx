import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import "./ErrorPage.css";
import "./BackofficePage.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ApiModels } from "../enums";

export const BackofficePage = () => {
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userRole !== "Admin") {
      setError("Go away you little rat😘🤓😛😛😛");
    } else {
      setError(null);
    }
  }, [user]);

  if (error) {
    return (
      <div className="error-container">
        {Array.from({ length: 100 }).map((_, index) => (
          <div
            key={index}
            className="flying-text"
            onClick={() => navigate("/")}
          >
            {error}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <header className="backoffice__header">
        <nav>
          <ul>
            {Object.keys(ApiModels).map((key) => (
              <li key={key}>
                <Link
                  to={`/backoffice/${ApiModels[key as keyof typeof ApiModels]}`}
                >
                  {ApiModels[key as keyof typeof ApiModels]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <h1>Backoffice</h1>
      <Outlet />
    </>
  );
};
