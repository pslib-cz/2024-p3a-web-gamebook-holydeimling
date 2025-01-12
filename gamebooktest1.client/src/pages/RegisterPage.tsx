import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenForm } from "../components/Home/HomeScreenForm";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./RegisterPage.css";
import axios from "axios";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const formData = {
    heading: "Registrace",
    inputs: [
      { placeholder: "uživatelské jméno", type: "text" },
      { placeholder: "e-mail", type: "email" },
      { placeholder: "heslo", type: "password" },
      { placeholder: "potvrzení hesla", type: "password" },
    ],
    buttonText: "Registrovat",
  };

  const handleRegister = async (formData: Record<string, string>) => {
    // Validate password match
    if (formData["heslo"] !== formData["potvrzení hesla"]) {
      setError("Hesla se neshodují");
      return;
    }

    // Create FormData object
    const formDataObj = new FormData();
    formDataObj.append("userName", formData["uživatelské jméno"]);
    formDataObj.append("email", formData["e-mail"]);
    formDataObj.append("password", formData["heslo"]);
    formDataObj.append("confirmPassword", formData["potvrzení hesla"]);

    try {
      const response = await axios.post("/api/Users/register", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle successful registration
      console.log("Registration successful:", response.data);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Registrace selhala");
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
          onSubmit={handleRegister}
        />
        <HomeScreenButton text="Zpět" onClick={() => navigate("/")} />
      </div>
    </main>
  );
};
