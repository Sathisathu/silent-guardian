import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Sync token across tabs
  useEffect(() => {
    const watchStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", watchStorage);
    return () => window.removeEventListener("storage", watchStorage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            !token ? (
              <Login onLogin={() => setToken(localStorage.getItem("token"))} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !token ? (
              <Register onRegister={() => setToken(localStorage.getItem("token"))} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
