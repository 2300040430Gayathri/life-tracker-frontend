import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/notebook.css";

function SkillNotebook() {
  const { title } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getLocalDate = () => {
    const today = new Date();
    return (
      today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  const today = getLocalDate();

  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      const res = await fetch("https://life-tracker-backend-l5se.onrender.com/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const skill = data.find(s => s.title === title);

      if (skill?.notes) {
        const todayNote = skill.notes.find(n => n.date === today);
        if (todayNote) setNote(todayNote.text);
      }
    };

    fetchSkill();
  }, [title]);

  const saveNote = async () => {
    await fetch(
      `https://life-tracker-backend-l5se.onrender.com/skills/${title}/note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: today, text: note }),
      }
    );

    setIsEditing(false);
  };

  return (
    <div className="main-skill-notebook-wrapper">

      <button
        className="main-skill-notebook-back"
        onClick={() => navigate("/skills")}
      >
        ← Back
      </button>

      <h2 className="main-skill-notebook-title">{title}</h2>

      <div className="main-skill-notebook-date">
        {today}
      </div>

      {!isEditing && (
        <button
          className="main-skill-notebook-edit"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      )}

      <textarea
        className="main-skill-notebook-textarea"
        value={note}
        readOnly={!isEditing}
        onChange={(e) => setNote(e.target.value)}
      />

      {isEditing && (
        <button
          className="main-skill-notebook-save"
          onClick={saveNote}
        >
          Save
        </button>
      )}

    </div>
  );
}

export default SkillNotebook;