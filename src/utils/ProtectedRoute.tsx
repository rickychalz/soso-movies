import useAuthStore from "@/store/auth-context";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const { isLoggedIn, setRedirectPath } = useAuthStore();

  if (!isLoggedIn) {
    // Save the current path to redirect after login
    setRedirectPath(window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
