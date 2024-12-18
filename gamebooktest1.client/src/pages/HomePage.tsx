import { useEffect, useState } from "react";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

export const HomePage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [homeScreenButtonsData, setHomeScreenButtonsData] = useState([
    {
      text: "Hrát",
      onClick: () => {
        setDataToRender(playScreenButtonsData);
      },
    },
    {
      text: "Přihlášení",
      onClick: () => {
        setDataToRender(loginScreenButtonsData);
      },
    },
    {
      text: "Zásluhy",
      onClick: () => console.log("Options"),
    },
  ]);
  const [homeScreenButtonsDataLoggedIn, setHomeScreenButtonsDataLoggedIn] =
    useState([
      {
        text: "Hrát",
        onClick: () => {
          setDataToRender(playScreenButtonsData);
        },
      },
      {
        text: "Zásluhy",
        onClick: () => console.log("Options"),
      },
      {
        text: "Odhlásit se",
        onClick: () => {
          setUser(null);
          setDataToRender(homeScreenButtonsData);
        },
      },
    ]);

  const [loginScreenButtonsData, setLoginScreenButtonsData] = useState([
    {
      text: "Přihlásit se",
      onClick: () => navigate("/login"),
    },
    {
      text: "Registrace",
      onClick: () => navigate("/register"),
    },
    {
      text: "Zpět",
      onClick: () => {
        setDataToRender(homeScreenButtonsData);
      },
    },
  ]);
  const [playScreenButtonsData, setPlayScreenButtonsData] = useState([
    {
      text: "Nová hra",
      onClick: () => console.log("New Game"),
    },
    {
      text: "Pokračovat",
      onClick: () => console.log("Continue"),
    },
    {
      text: "Zpět",
      onClick: () => {
        setDataToRender(homeScreenButtonsData);
      },
    },
  ]);

  const [dataToRender, setDataToRender] = useState(homeScreenButtonsData);

  useEffect(() => {
    if (user) {
      setDataToRender(homeScreenButtonsDataLoggedIn);
    } else {
      setDataToRender(homeScreenButtonsData);
    }
  }, [user]);

  return (
    <main className="homepage__container">
      <div className="items__container">
        <HomeScreenLogo />
        {dataToRender.map((buttonData, index) => (
          <HomeScreenButton key={index} {...buttonData} />
        ))}
      </div>
      <span>id: {user?.id}</span>
      <span>email: {user?.email}</span>
      <span>role: {user?.userRole}</span>
      <span>name: {user?.userName}</span>
      <span>gameState: {user?.gameState.checkpointSceneId}</span>
    </main>
  );
};
