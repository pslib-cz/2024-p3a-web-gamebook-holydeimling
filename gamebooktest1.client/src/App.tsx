import { useEffect, useState } from "react";
import "./App.css";
import { HomeScreenButton } from "./components/Home/HomeScreenButton";
import { HomeScreenLogo } from "./components/Home/HomeScreenLogo";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { GameTest } from "./pages/GameTest";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ImageUpload } from "./pages/ImageUpload";
import { FetchingDataTest } from "./pages/FetchingDataTest";

/* interface Forecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
} */

function App() {
  /*   const [forecasts, setForecasts] = useState<Forecast[]>();

  useEffect(() => {
    populateWeatherData();
  }, []);

  const contents =
    forecasts === undefined ? (
      <p>
        <em>
          Loading... Please refresh once the ASP.NET backend has started. See{" "}
          <a href="https://aka.ms/jspsintegrationreact">
            https://aka.ms/jspsintegrationreact
          </a>{" "}
          for more details.
        </em>
      </p>
    ) : (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((forecast) => (
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
 */
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/gametest",
      element: <GameTest />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/image-upload",
      element: <ImageUpload />,
    },
    {
      path: "dataTest",
      element: <FetchingDataTest />,
    },
  ]);
  return (
    /*     <div>
      <h1 id="tableLabel">Weather forecast</h1>
      <p>This component demonstrates fetching data from the server.</p>{" "}
      {contents}
    </div> */
    <RouterProvider router={router} />
  );
  /* 
  async function populateWeatherData() {
    const response = await fetch("weatherforecast");
    const data = await response.json();
    setForecasts(data);
  }*/
}

export default App;
