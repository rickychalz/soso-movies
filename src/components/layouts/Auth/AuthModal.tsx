import { useState } from "react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  onClose: () => void;  // Add onClose prop to close the modal
}

export const AuthModal = ({  onClose = () => {} }: AuthModalProps) => {
  const [currentPage, setCurrentPage] = useState("login");
  const navigate = useNavigate();

  const handleRedirect = () => {
    onClose(); // Close the modal
    navigate("/"); // Redirect to "/"
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <Login
            onRegister={() => setCurrentPage("register")}
            onForgotPassword={() => setCurrentPage("forgot-password")}
            onClose={onClose}  // Pass onClose to Login
            onRedirect={handleRedirect}  // Pass handleRedirect to Login
          />
        );
      case "register":
        return (
          <Register
            onLogin={() => setCurrentPage("login")}
            onClose={onClose}  // Pass onClose to Register
            onRedirect={handleRedirect}  // Pass handleRedirect to Register
          />
        );
      default:
        return null;
    }
  };

  return (
    <DialogContent className="sm:h-[600px] bg-[#212121] text-white border border-[#212121]">
      <DialogHeader />
      {renderCurrentPage()}
      <DialogFooter />
    </DialogContent>
  );
};
