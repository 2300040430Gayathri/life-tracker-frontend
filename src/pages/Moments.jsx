import { useState, useEffect } from "react";
import "../styles/moments.css";

function Moments() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch("https://life-tracker-backend-l5se.onrender.com/moments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        const formatted = {};
        data.forEach((item) => {
          formatted[item.date] = item.text;
        });
        setNotes(formatted);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const timer = setTimeout(async () => {
      await fetch("https://life-tracker-backend-l5se.onrender.com/moments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          text: text,
        }),
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [text]);

  const monthNames = [
    "JAN","FEB","MAR","APR","MAY","JUN",
    "JUL","AUG","SEP","OCT","NOV","DEC"
  ];

  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
    setSelectedDate(null);
    setText("");
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
    setSelectedDate(null);
    setText("");
  };

  const handleDateClick = (day) => {
    const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    setSelectedDate(key);
    setText(notes[key] || "");
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    setNotes({
      ...notes,
      [selectedDate]: value
    });
  };

  return (
    <div className="main-moments-wrapper">
      <div className="main-moments-container">

        <h3 className="main-moments-title">Moments</h3>

        <div className="main-moments-header">
          <button onClick={prevMonth}>‹</button>
          <span>{year} {monthNames[month]}</span>
          <button onClick={nextMonth}>›</button>
        </div>

        <div className="main-moments-weekdays">
          {daysOfWeek.map(d => (
            <div key={d} className="main-moments-weekday">{d}</div>
          ))}
        </div>

        <div className="main-moments-grid">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={i}></div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

            return (
              <div
                key={day}
                className={`main-moments-day ${
                  (notes[key] || selectedDate === key)
                    ? "main-moments-active"
                    : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="main-moments-note">
            <div className="main-moments-date">{selectedDate}</div>

            <textarea
              className="main-moments-textarea"
              placeholder="Why this day is special..."
              value={text}
              onChange={handleTextChange}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default Moments;