import { useState, useEffect } from "react";
import CalendarPopupPersonal from "./CalendarPopupPersonal";

function PersonalItem({
  label,
  type,
  min,
  max,
  itemKey,
  activeItem,
  setActiveItem,
  activeCalendar,
  setActiveCalendar,
}) {

  const token = localStorage.getItem("token");
  const todayKey = new Date().toISOString().split("T")[0];

  const [data, setData] = useState({});

  const isOpen = activeItem === itemKey;
  const isCalendarOpen = activeCalendar === itemKey;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("https://life-tracker-backend-l5se.onrender.com/personal", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    const formatted = {};

    result.forEach(r => {
      if (!formatted[r.date]) formatted[r.date] = {};
      formatted[r.date][r.itemKey] = r.value;
    });

    setData(formatted);
  };

  const saveValue = async (value) => {

    await fetch("https://life-tracker-backend-l5se.onrender.com/personal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: todayKey,
        itemKey,
        value,
      }),
    });

    fetchData();
  };

  const selectedValue = data?.[todayKey]?.[itemKey];

  return (
    <>
      <div className="personal-item" onClick={() =>
        setActiveItem(prev => prev === itemKey ? null : itemKey)
      }>
        <span>{label}</span>
      </div>

      {isOpen && (
        <div className="personal-dropdown">

          {type === "yesno" && (
            <>
              <div
                className={`personal-option ${selectedValue === "yes" ? "selected" : ""}`}
                onClick={() => saveValue("yes")}
              >
                Yes
              </div>

              <div
                className={`personal-option ${selectedValue === "no" ? "selected" : ""}`}
                onClick={() => saveValue("no")}
              >
                No
              </div>
            </>
          )}

          {type === "range" &&
            Array.from({ length: max - min + 1 }, (_, i) => min + i)
              .map(num => (
                <div
                  key={num}
                  className={`personal-option ${selectedValue === num ? "selected" : ""}`}
                  onClick={() => saveValue(num)}
                >
                  {itemKey === "sleep" ? `${num}h` : num}
                </div>
              ))}
        </div>
      )}

      {isCalendarOpen && (
        <CalendarPopupPersonal
          data={data}
          itemKey={itemKey}
          onClose={() => setActiveCalendar(null)}
        />
      )}
    </>
  );
}

export default PersonalItem;