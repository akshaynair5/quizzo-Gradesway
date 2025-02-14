import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext"; 
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    try {
      const userData = await loginUser(username, password);
      login(userData.user); 
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid credentials! Please try again."); 
    }
  };

  return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Login</h2>
        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>} 
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="dark:bg-gray-700 dark:text-white"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="dark:bg-gray-700 dark:text-white"
        />
        <Button type="submit" className="w-full bg-blue-600 dark:bg-blue-500 text-white">Login</Button>
      </form>
    </div>
  );
};

export default Login;
