import React, { useState } from "react";
import "../styles/calendarPopup.css";

function CalendarPopup({ skill }) {

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (day) => {
    const d = new Date(year, month, day);
    return (
      d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  const notes = skill?.notes || [];

  const getColorClass = (date) => {
    const entry = notes.find(n => n.date === date);

    if (!entry) return "";
    if (entry.text && entry.text.trim() !== "")
      return "main-skill-calendar-dark";
    return "main-skill-calendar-light";
  };

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  return (
    <div className="main-skill-calendar-wrapper">

      <div className="main-skill-calendar-header">
        <button onClick={() => changeMonth(-1)}>◀</button>
        <span>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </span>
        <button onClick={() => changeMonth(1)}>▶</button>
      </div>

      <div className="main-skill-calendar-grid">
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const date = formatDate(day);

          return (
            <div
              key={day}
              className={`main-skill-calendar-day ${getColorClass(date)}`}
            >
              {day}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default CalendarPopup;