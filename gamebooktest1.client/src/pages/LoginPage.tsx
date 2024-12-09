import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenForm } from "../components/Home/HomeScreenForm";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./LoginPage.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // API call
    try {
      const response = await fetch("https://your-backend-url/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.Redirect === "game") {
          navigate("/game");
        } else {
          navigate("/backoffice"); // Keep for future use
        }
      } else {
        setErrorMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const formData = {
    heading: "Přihlášení",
    inputs: [
      { placeholder: "e-mail", type: "email", value: email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
      { placeholder: "heslo", type: "password", value: password, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
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
          onSubmit={handleLogin}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <HomeScreenButton text="Zpět" onClick={() => navigate("/")} />
      </div>
    </main>
  );
};
