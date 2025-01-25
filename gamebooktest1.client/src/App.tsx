import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { GameTest } from "./pages/GameTest";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ImageUpload } from "./pages/ImageUpload";
import { FileUpload } from "./pages/FileUpload";
import { ScenePage } from "./pages/Scene";
import { BackofficePage } from "./pages/BackofficePage";
import {
  BackofficeCategoryPage,
  BackofficeCategoryRouter,
} from "./pages/BackofficeCategoryPage"; // Import the category page
import { Toaster } from "sonner";
import { UserProvider } from "./UserContext";

function App() {
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
      path: "/file-upload",
      element: <FileUpload />,
    },
    {
      path: "/scene/:id", // Add dynamic parameter for scene ID
      element: <ScenePage />,
    },
    {
      path: "/backoffice",
      element: <BackofficePage />,
      children: [
        {
          path: ":category", // Dynamically load the category
          element: <BackofficeCategoryPage />,
          children: [
            {
              path: ":id", // Dynamically load the ID
              element: <BackofficeCategoryRouter />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </UserProvider>
    </>
  );
}

export default App;
