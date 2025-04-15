import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("✅ App installed");
        } else {
          console.log("❌ User dismissed install");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  useEffect(() => {
    const watchStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", watchStorage);
    return () => window.removeEventListener("storage", watchStorage);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
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

      {showInstallButton && (
        <button className="install-btn" onClick={handleInstallClick}>
          📲 Install App
        </button>
      )}
    </>
  );
}

export default App;
