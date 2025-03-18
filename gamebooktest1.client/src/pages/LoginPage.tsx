import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeScreenButton } from "../components/Home/HomeScreenButton";
import { HomeScreenForm } from "../components/Home/HomeScreenForm";
import { HomeScreenLogo } from "../components/Home/HomeScreenLogo";
import "./LoginPage.css";
import axios from "axios";
import { User, useUser } from "../UserContext";
import { toast } from "sonner";
import { Radio } from "../components/Radio";

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
      const response = await axios.post("/api/Users/login", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle successful login (e.g., store user info, redirect)
      console.log("Login successful:", response.data);
      toast.success("Přihlášení proběhlo úspěšně");
      setUser(response.data as User);
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
        toast.error("Přihlášení selhalo: " + error.response?.data);
      } else {
        setError("Nastala neočekávaná chyba");
        toast.error("Nastala neočekávaná chyba");
      }
    }
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

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
        <HomeScreenButton text="Zpět" onClick={() => navigate("/")} />
      </div>
      <Radio y={10} x={10} />
    </main>
  );
};
