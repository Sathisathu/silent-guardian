import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      // Optional: store userId
      if (res.data.user?._id) {
        localStorage.setItem("userId", res.data.user._id);
      }

      onLogin(); // 🔥 Notify App to refresh auth state
      navigate("/"); // 🚀 Go to dashboard
    } catch (err) {
      console.error(
        "❌ Login Error:",
        err.response?.data?.message || err.message
      );
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>

      <p className="switch-link">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </form>
  );
}
