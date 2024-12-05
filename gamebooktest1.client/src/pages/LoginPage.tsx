import { useNavigate } from "react-router-dom";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenForm } from "../components/Home/HomeScreenForm";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./LoginPage.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const formData = {
    heading: "Přihlášení",
    inputs: [
      { placeholder: "e-mail", type: "email" },
      { placeholder: "heslo", type: "password" },
    ],
    buttonText: "Přihlásit se",
  };
  return (
    <main className="homepage__container">
      <div className="items__container">
        <HomeScreenLogo />
        <HomeScreenForm
          heading={formData.heading}
          inputs={formData.inputs}
          buttonText={formData.buttonText}
        />
        <HomeScreenButton text="Zpět" onClick={() => navigate("/")} />
      </div>
    </main>
  );
};
