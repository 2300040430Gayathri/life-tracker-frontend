import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const response = await fetch("https://life-tracker-backend-l5se.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Server error");
  }
};

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="title">
          Welcome <span className="welcome-dog">🐶</span>
        </h1>

        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLogin}>
          Login
        </button>

        <p className="forgot-text">Forgot password?</p>

        <button
          className="signup-secondary-btn"
          onClick={() => navigate("/signup")}
        >
          Create one
        </button>

      </div>
    </div>
  );
}
