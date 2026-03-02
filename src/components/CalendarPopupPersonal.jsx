import { useState } from "react";
import "../styles/calendarPopupPersonal.css";

function CalendarPopupPersonal({ data = {}, itemKey, onClose }) {

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getFullDate = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="main-personal-calendar-overlay">

      <div className="main-personal-calendar-container">

        <div className="main-personal-calendar-header">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
            ◀
          </button>

          <h4>
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </h4>

          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
            ▶
          </button>
        </div>

        <div className="main-personal-calendar-grid">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const fullDate = getFullDate(day);
            const value = data?.[fullDate]?.[itemKey];

            return (
              <div
                key={day}
                className="main-personal-calendar-day"
                style={{
                  background: value
                    ? `rgba(169, 116, 87, ${value / 10})`
                    : "#ffffff",
                  color: value ? "white" : "black",
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        <button
          className="main-personal-calendar-close"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}

export default CalendarPopupPersonal;