import { useEffect, useState } from "react";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import audio from "../assets/music/cesky-hello-neighbor-song-remix.mp3";
import ReactAudioPlayer from "react-audio-player";

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
      onClick: () => console.log("Zásluhy"),
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
  const [
    homeScreenButtonsDataAdminLoggedIn,
    setHomeScreenButtonsDataAdminLoggedIn,
  ] = useState([
    {
      text: "Hrát",
      onClick: () => {
        setDataToRender(playScreenButtonsData);
      },
    },
    {
      text: "Backoffice",
      onClick: () => navigate("/backoffice"),
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
        setDataToRender(
          user?.userRole === "Admin"
            ? homeScreenButtonsDataAdminLoggedIn
            : homeScreenButtonsData
        );
      },
    },
  ]);
  const [playScreenButtonsData, setPlayScreenButtonsData] = useState([
    {
      text: "Nová hra",
      onClick: () => navigate("/scene"),
    },
    {
      text: "Pokračovat",
      onClick: () => console.log("Continue"),
    },
    {
      text: "Zpět",
      onClick: () => {
        setDataToRender(
          user?.userRole === "Admin"
            ? homeScreenButtonsDataAdminLoggedIn
            : homeScreenButtonsData
        );
      },
    },
  ]);

  const [dataToRender, setDataToRender] = useState(homeScreenButtonsData);

  useEffect(() => {
    if (user) {
      if (user.userRole === "Admin") {
        setDataToRender(homeScreenButtonsDataAdminLoggedIn);
      } else {
        setDataToRender(homeScreenButtonsDataLoggedIn);
      }
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
      <span>id: {user?.id} </span>
      <br />
      <span>email: {user?.email} </span>
      <br />
      <span>role: {user?.userRole} </span>
      <br />
      <span>name: {user?.userName} </span>
      <br />
      <span>checkpointId {user?.gameState.checkpointSceneId} </span>
      <br />
      <span>gamestate id {user?.gameState.gameStateId} </span>
      <br />
      <span>inventoryState {user?.gameState.inventoryState.inventoryId} </span>
    </main>
  );
};
