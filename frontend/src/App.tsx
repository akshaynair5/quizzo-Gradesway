import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedWrapper from "./components/ProtectedWrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QuizForm from "./pages/QuizForm";
import Navbar from "./components/Navbar";
import QuizDetail from "./pages/QuizDetail";

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedWrapper><Dashboard /></ProtectedWrapper>} />
        <Route path="/create-quiz" element={<ProtectedWrapper><QuizForm /></ProtectedWrapper>} />
        <Route path="/quiz/:id" element={<ProtectedWrapper><QuizDetail /></ProtectedWrapper>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
