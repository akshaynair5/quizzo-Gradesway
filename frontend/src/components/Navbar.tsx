import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Quizo</h1>
      <div className="space-x-4">
        {!currentUser ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/create-quiz" className="hover:underline">Create Quiz</Link>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
