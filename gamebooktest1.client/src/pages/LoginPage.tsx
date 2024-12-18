import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenForm } from "../components/Home/HomeScreenForm";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./LoginPage.css";
import axios from "axios";
import { useUser } from "../UserContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const formData = {
    heading: "Přihlášení",
    inputs: [
      { placeholder: "e-mail", type: "email" },
      { placeholder: "heslo", type: "password" },
    ],
    buttonText: "Přihlásit se",
  };

  const handleLogin = async (formData: Record<string, string>) => {
    // Create FormData object
    const formDataObj = new FormData();
    formDataObj.append("email", formData["e-mail"]);
    formDataObj.append("password", formData["heslo"]);

    try {
      const response = await axios.post(
        "https://localhost:7174/api/Users/login",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful login (e.g., store user info, redirect)
      console.log("Login successful:", response.data);
      setUser(response.data);
      setUser({
        id: response.data.id,
        email: response.data.email,
        userRole: response.data.userRole,
        userName: response.data.userName,
        gameState: response.data.gameState,
      });
      navigate("/"); // Redirect to dashboard or home page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Přihlášení selhalo");
      } else {
        setError("Nastala neočekávaná chyba");
      }
    }
  };

  return (
    <main className="homepage__container">
      <div className="items__container">
        <HomeScreenLogo />
        {error && <div className="error-message">{error}</div>}
        <HomeScreenForm
          heading={formData.heading}
          inputs={formData.inputs}
          buttonText={formData.buttonText}
          onSubmit={handleLogin}
        />
        <HomeScreenButton text="Zpět" onClick={() => navigate("/")} />
      </div>
    </main>
  );
};
