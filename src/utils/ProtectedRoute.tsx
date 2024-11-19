import { ReactNode } from "react"; 
import useAuthStore from "@/store/auth-context"; 
import { Navigate } from "react-router-dom"; 

interface ProtectedRouteProps {
  children: ReactNode; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, setRedirectPath } = useAuthStore();

  if (!isLoggedIn) {
    // Save the current path to redirect after login
    setRedirectPath(window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the children (Profile, etc.)
  return <>{children}</>;
};

export default ProtectedRoute;
