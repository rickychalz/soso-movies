import { ReactNode } from "react"; // Import ReactNode to define the type for children
import useAuthStore from "@/store/auth-context"; // Your auth store
import { Navigate } from "react-router-dom"; // React Router components

interface ProtectedRouteProps {
  children: ReactNode; // Type the 'children' prop as ReactNode (the type of all valid JSX elements)
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
