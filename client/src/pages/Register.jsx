import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const API_BASE = import.meta.env.VITE_API_BASE;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/register`,
        formData
      );
      localStorage.setItem("token", res.data.token);
      if (res.data.user?._id) {
        localStorage.setItem("userId", res.data.user._id);
      }
      onRegister(); // 🔄 Let App.jsx update auth state
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      console.error("❌ Register Error:", message);
      alert("Registration failed: " + message);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
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
      <button type="submit">Register</button>

      <p className="switch-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
