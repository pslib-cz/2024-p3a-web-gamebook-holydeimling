import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ScenePage } from "./pages/Scene";
import { BackofficePage } from "./pages/Backoffice/BackofficePage";
import { Toaster } from "sonner";
import { UserProvider } from "./UserContext";
import { AboutPage } from "./pages/AboutPage/AboutPage";
import { StoryPage } from "./pages/AboutPage/StoryPage";
import { MainCharactersPage } from "./pages/AboutPage/MainCharactersPage";
import { AboutCreators } from "./pages/AboutPage/AboutCreators";
import { ControlsPage } from "./pages/AboutPage/Controls";
import { AdminRouteGuard } from "./components/AdminRouteGuard";

function App() {
  // Define the basename based on the deployment environment
  // This ensures routing works in both development and production
  const basename = "/";

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <HomePage />,
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
        path: "/scene/:id", // Add dynamic parameter for scene ID
        element: <ScenePage />,
      },
      {
        path: "/backoffice",
        element: (
          <AdminRouteGuard>
            <BackofficePage />
          </AdminRouteGuard>
        ),
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
      // Add a catch-all route to handle 404s gracefully
      {
        path: "*",
        element: <HomePage />
      }
    ],
    { basename }
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </UserProvider>
  );
}

export default App;
