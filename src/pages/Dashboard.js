import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("https://life-tracker-backend-l5se.onrender.com/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="main-dashboard-wrapper">
      <div className="main-dashboard-container">

        <div className="main-dashboard-top">
          <div className="main-dashboard-username">
            {user && user.name}
          </div>

          <ProfileMenu />
        </div>

        <div className="main-dashboard-grid">

          <div
            className="main-dashboard-card"
            onClick={() => navigate("/personal")}
          >
            <div className="main-dashboard-icon">💖</div>
            <h3>Personal</h3>
          </div>

          <div
            className="main-dashboard-card"
            onClick={() => navigate("/skills")}
          >
            <div className="main-dashboard-icon">💼</div>
            <h3>Professional</h3>
          </div>

          <div
            className="main-dashboard-card"
            onClick={() => navigate("/daily")}
          >
            <div className="main-dashboard-icon">🕰️</div>
            <h3>Daily Routine</h3>
          </div>

          <div
            className="main-dashboard-card"
            onClick={() => navigate("/todo")}
          >
            <div className="main-dashboard-icon">📝</div>
            <h3>To-Do</h3>
          </div>

          <div
            className="main-dashboard-card main-dashboard-card-center"
            onClick={() => navigate("/moments")}
          >
            <div className="main-dashboard-icon">📅</div>
            <h3>Important Dates</h3>
          </div>

        </div>
      </div>
    </div>
  );
}