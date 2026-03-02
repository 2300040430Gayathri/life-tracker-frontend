import { useState, useEffect } from "react";
import "../styles/routine.css";

const HOURS = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);

const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

const PERIODS = ["AM", "PM"];

function DailyRoutine() {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");
  const [adding, setAdding] = useState(false);

  const [newTask, setNewTask] = useState({
    sh: "08",
    sm: "00",
    eh: "09",
    em: "00",
    p: "AM",
    text: "",
  });

  const fetchRoutines = async () => {
    const res = await fetch("https://life-tracker-backend-l5se.onrender.com/routines", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const toggle = async (task) => {
    await fetch(`https://life-tracker-backend-l5se.onrender.com/routines/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    fetchRoutines();
  };

  const saveEdit = async (task) => {
    await fetch(`https://life-tracker-backend-l5se.onrender.com/routines/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: value,
      }),
    });

    setEditing(null);
    setValue("");
    fetchRoutines();
  };

  const remove = async (id) => {
    await fetch(`https://life-tracker-backend-l5se.onrender.com/routines/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchRoutines();
  };

  const addTask = async () => {
    if (!newTask.text.trim()) return;

    await fetch("https://life-tracker-backend-l5se.onrender.com/routines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        time: `${newTask.sh}:${newTask.sm} ~ ${newTask.eh}:${newTask.em} ${newTask.p}`,
        text: newTask.text,
      }),
    });

    setNewTask({
      sh: "08",
      sm: "00",
      eh: "09",
      em: "00",
      p: "AM",
      text: "",
    });

    setAdding(false);
    fetchRoutines();
  };

  return (
    <div className="main-routine-wrapper">
      <div className="main-routine-container">

        <h3 className="main-routine-title">Daily Routine</h3>

        {tasks.map((t) => (
          <div key={t._id} className="main-routine-row">

            <div className="main-routine-time">
              {t.time}
            </div>

            <div className={`main-routine-task ${t.completed ? "main-routine-completed" : ""}`}>
              {editing === t._id ? (
                <textarea
                  className="main-routine-edit-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              ) : (
                <span>{t.text}</span>
              )}

              <div
                className={`main-routine-circle ${t.completed ? "main-routine-circle-done" : ""}`}
                onClick={() => toggle(t)}
              />
            </div>

            <div className="main-routine-actions">
              {editing === t._id ? (
                <button onClick={() => saveEdit(t)}>✔</button>
              ) : (
                <button
                  onClick={() => {
                    setEditing(t._id);
                    setValue(t.text);
                  }}
                >
                  ✏️
                </button>
              )}

              <button onClick={() => remove(t._id)}>🗑️</button>
            </div>

          </div>
        ))}

        {adding ? (
          <div className="main-routine-add-block">

            <select
              value={newTask.sh}
              onChange={(e) =>
                setNewTask({ ...newTask, sh: e.target.value })
              }
            >
              {HOURS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            :

            <select
              value={newTask.sm}
              onChange={(e) =>
                setNewTask({ ...newTask, sm: e.target.value })
              }
            >
              {MINUTES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <span> ~ </span>

            <select
              value={newTask.eh}
              onChange={(e) =>
                setNewTask({ ...newTask, eh: e.target.value })
              }
            >
              {HOURS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            :

            <select
              value={newTask.em}
              onChange={(e) =>
                setNewTask({ ...newTask, em: e.target.value })
              }
            >
              {MINUTES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select
              value={newTask.p}
              onChange={(e) =>
                setNewTask({ ...newTask, p: e.target.value })
              }
            >
              {PERIODS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <textarea
              className="main-routine-add-text"
              placeholder="Task"
              value={newTask.text}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  text: e.target.value,
                })
              }
            />

            <button onClick={addTask}>Add</button>

          </div>
        ) : (
          <button
            className="main-routine-add-btn"
            onClick={() => setAdding(true)}
          >
            + Add
          </button>
        )}

      </div>
    </div>
  );
}

export default DailyRoutine;