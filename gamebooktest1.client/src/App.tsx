import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { GameTest } from "./pages/GameTest";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ImageUpload } from "./pages/ImageUpload";
import { FileUpload } from "./pages/FileUpload";
import { ScenePage } from "./pages/Scene";
import { BackofficePage } from "./pages/Backoffice/BackofficePage";
import { Toaster } from "sonner";
import { UserProvider } from "./UserContext";
import { AboutPage } from "./pages/AboutPage/AboutPage";
import { StoryPage } from "./pages/AboutPage/StoryPage";
import { MainCharactersPage } from "./pages/AboutPage/MainCharactersPage";
import { AboutCreators } from "./pages/AboutPage/AboutCreators";
import { ControlsPage } from "./pages/AboutPage/Controls";

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
    },
    {
      path: "/about",
      element: <AboutPage />,
      children: [
        {
          path: "/about/story",
          element: <StoryPage />,
        },
        {
          path: "/about/characters",
          element: <MainCharactersPage />,
        },
        {
          path: "/about/creators",
          element: <AboutCreators />,
        },
        {
          path: "/about/controls",
          element: <ControlsPage />,
        },
      ],
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </UserProvider>
  );
}

export default App;
