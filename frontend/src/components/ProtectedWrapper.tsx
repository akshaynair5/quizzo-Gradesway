import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedWrapper = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedWrapper;
