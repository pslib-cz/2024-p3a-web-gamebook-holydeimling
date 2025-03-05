import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../UserContext";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { user } = useUser();
  const location = useLocation();

  // Check if user exists and is admin
  if (!user || user.userRole !== "Admin") {
    // Redirect to login if not logged in, or home if not admin
    const redirectTo = !user ? "/login" : "/";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
