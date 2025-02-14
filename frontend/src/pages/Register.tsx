import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(username, password);
      navigate("/login");
    } catch (err : any) {
      setError(err.response.data.message);
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Register</h2>
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
        <Button type="submit" className="w-full bg-green-600 dark:bg-green-500 text-white">Register</Button>
      </form>
    </div>
  );
};

export default Register;
