import { useEffect, useState } from "react";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { newGame, loadGame } from "../utils/startGame";
import { Radio } from "../components/Radio";
import { toast, Toaster } from "sonner";
import { startSceneId } from "../utils/constants";

export const HomePage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

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
  }, []);

  const [homeScreenButtonsData] = useState([
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
      onClick: () => navigate("/about"),
    },
  ]);

  const [homeScreenButtonsDataLoggedIn] = useState([
    {
      text: "Hrát",
      onClick: () => {
        setDataToRender(playScreenButtonsData);
      },
    },
    {
      text: "Zásluhy",
      onClick: () => navigate("/about"),
    },
    {
      text: "Odhlásit se",
      onClick: () => {
        setUser(null);
        setDataToRender(homeScreenButtonsData);
        navigate("/");
        toast.success("Odhlášení proběhlo úspěšně");
      },
    },
  ]);

  const [homeScreenButtonsDataAdminLoggedIn] = useState([
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
        navigate("/");
        toast.success("Odhlášení proběhlo úspěšně");
      },
    },
  ]);

  const [loginScreenButtonsData] = useState([
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

  const [playScreenButtonsData] = useState([
    {
      text: "Nová hra",
      onClick: async () => {
        await newGame(user, setUser);
        navigate(`/scene/${startSceneId}`);
      },
    },
    {
      text: "Pokračovat",
      onClick: async () => {
        if (
          user?.gameState.checkpointSceneId === 0 ||
          user?.gameState.checkpointSceneId === null ||
          user?.gameState.checkpointSceneId === undefined ||
          user?.gameState.checkpointSceneId === 1
        ) {
          toast.error("Nemáte žádnou uloženou hru");
          return;
        }
        await loadGame(user, setUser);
        navigate(`/scene/${user?.gameState.checkpointSceneId || 1}`);
      },
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
      {user && (
        <>
          <span>id: {user.id} </span>
          <br />
          <span>email: {user.email} </span>
          <br />
          <span>role: {user.userRole} </span>
          <br />
          <span>name: {user.userName} </span>
          <br />
          <span>checkpointId {user.gameState?.checkpointSceneId} </span>
          <br />
          <span>gamestate id {user.gameState?.gameStateId} </span>
          <br />
          <span>
            inventoryState {user.gameState?.inventoryState?.inventoryId}{" "}
          </span>
          <Radio y={5} x={20} width={100} height={100} />
        </>
      )}
      <Toaster richColors />
    </main>
  );
};
