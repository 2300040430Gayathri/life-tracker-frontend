import { useState, useEffect } from "react";
import "../styles/todo.css";

function Todo() {
  const todayDate = new Date().toISOString().split("T")[0];

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("https://life-tracker-backend-l5se.onrender.com/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) setTasks(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://life-tracker-backend-l5se.onrender.com/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();
      if (response.ok) {
        setTasks([data, ...tasks]);
        setInput("");
      }
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`https://life-tracker-backend-l5se.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(tasks.filter((task) => task._id !== id));
  };

  const toggleComplete = async (id, currentStatus) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://life-tracker-backend-l5se.onrender.com/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !currentStatus }),
      }
    );

    const updatedTask = await response.json();

    setTasks(
      tasks.map((task) =>
        task._id === id ? updatedTask : task
      )
    );
  };

  const onDragStart = (index) => setDragIndex(index);

  const onDrop = (index) => {
    if (dragIndex === null) return;

    const updated = [...tasks];
    const draggedItem = updated[dragIndex];

    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);

    setTasks(updated);
    setDragIndex(null);
  };

  return (
    <div className="main-todo-wrapper">
      <div className="main-todo-container">

        <div className="main-todo-header">
          <span className="main-todo-title">Today works</span>
          <span className="main-todo-date">{todayDate}</span>
        </div>

        <div className="main-todo-input-bar">
          <input
            className="main-todo-input"
            type="text"
            placeholder="Type here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            className="main-todo-add-btn"
            onClick={addTask}
          >
            + add
          </button>
        </div>

        <div className="main-todo-list">
          {tasks.length === 0 ? (
            <p className="main-todo-empty">No tasks yet</p>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task._id}
                className={`main-todo-item ${
                  task.completed ? "main-todo-completed" : ""
                }`}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(index)}
              >
                <span
                  className="main-todo-text"
                  onDoubleClick={() => {
                    const newText = prompt("Edit task:", task.text);
                    if (newText) {
                      fetch(
                        `https://life-tracker-backend-l5se.onrender.com/tasks/${task._id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify({ text: newText }),
                        }
                      ).then(() => {
                        setTasks(
                          tasks.map((t) =>
                            t._id === task._id
                              ? { ...t, text: newText }
                              : t
                          )
                        );
                      });
                    }
                  }}
                >
                  {task.text}
                </span>

                <div className="main-todo-actions">
                  <div
                    className={`main-todo-circle ${
                      task.completed ? "main-todo-circle-done" : ""
                    }`}
                    onClick={() =>
                      toggleComplete(task._id, task.completed)
                    }
                  ></div>

                  <button
                    className="main-todo-delete"
                    onClick={() => deleteTask(task._id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Todo;