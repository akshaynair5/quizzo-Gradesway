import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Login failed. Please try again." };
  }
};

export const registerUser = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { username, password });
    return res.data;
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "Registration failed. Please try again." };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
