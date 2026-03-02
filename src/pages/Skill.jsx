import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarPopup from "../components/CalendarPopup";
import "../styles/skill.css";

function Skill() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const defaultSkills = [
    "DSA","DBMS","SQL","OS","OOP",
    "System Design","Networking","AI / ML",
    "Full Stack","English","English Recording",
    "Aptitude","Reasoning","ECE Basics"
  ];

  const [dbSkills, setDbSkills] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(null);
  const [newSkill, setNewSkill] = useState("");

  const fetchSkills = async () => {
    const res = await fetch("https://life-tracker-backend-l5se.onrender.com/skills", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDbSkills(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const customSkills = dbSkills
    .map(s => s.title)
    .filter(title => !defaultSkills.includes(title));

  const allSkills = [...defaultSkills, ...customSkills];

  const getSkillFromDB = (title) =>
    dbSkills.find(s => s.title === title);

  const updateStatus = async (title, status) => {
    await fetch("https://life-tracker-backend-l5se.onrender.com/skills/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, status }),
    });

    await fetchSkills();
  };

  const handleDelete = async (title) => {
    const skill = getSkillFromDB(title);
    if (!skill) return;

    await fetch(`https://life-tracker-backend-l5se.onrender.com/skills/${skill._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchSkills();
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    await fetch("https://life-tracker-backend-l5se.onrender.com/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newSkill }),
    });

    setNewSkill("");
    fetchSkills();
  };

  return (
    <div className="main-skill-wrapper">
      <div className="main-skill-container">

        <h3 className="main-skill-title">Skill</h3>

        {allSkills.map(title => {
          const skill = getSkillFromDB(title);

          return (
            <div key={title} className="main-skill-block">

              <div className="main-skill-item">
                <span>{title}</span>

                {skill && (
                  <button
                    className="main-skill-delete"
                    onClick={() => handleDelete(title)}
                  >
                    🗑
                  </button>
                )}
              </div>

              <div className="main-skill-options">
                <button
                  className="main-skill-option"
                  onClick={async () => {
                    await updateStatus(title, "Yes");
                    navigate(`/skills/${title}`);
                  }}
                >
                  Yes
                </button>

                <button
                  className="main-skill-option"
                  onClick={async () => {
                    await updateStatus(title, "No");
                    setOpenCalendar(
                      openCalendar === title ? null : title
                    );
                  }}
                >
                  No
                </button>
              </div>

              {openCalendar === title && (
                <CalendarPopup skill={skill} />
              )}

            </div>
          );
        })}

        <div className="main-skill-add">
          <input
            className="main-skill-input"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add new skill..."
          />
          <button
            className="main-skill-add-btn"
            onClick={handleAddSkill}
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
}

export default Skill;