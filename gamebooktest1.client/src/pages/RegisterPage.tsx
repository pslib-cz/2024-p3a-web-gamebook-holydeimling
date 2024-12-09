import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenForm } from "../components/Home/HomeScreenForm";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./RegisterPage.css";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // API call
    try {
      const response = await fetch("https://your-backend-url/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: email.split("@")[0], // Generate username from email
          userEmail: email,
          userPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
      } else {
        setErrorMessage(data || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const formData = {
    heading: "Registrace",
    inputs: [
      {
        placeholder: "e-mail",
        type: "email",
        value: email,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      },
      {
        placeholder: "heslo",
        type: "password",
        value: password,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      },
      {
        placeholder: "potvrzení hesla",
        type: "password",
        value: confirmPassword,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value),
      },
    ],
    buttonText: "Registrovat",
  };

  return (
    <main className="homepage__container">
      <div className="items__container">
        <HomeScreenLogo />
        <HomeScreenForm
          heading={formData.heading}
          inputs={formData.inputs}
          buttonText={formData.buttonText}
          onSubmit={handleRegister}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <HomeScreenButton text="Zpět" onClick={() => navigate("/")} />
      </div>
    </main>
  );
};
