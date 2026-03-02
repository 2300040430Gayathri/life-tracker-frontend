import { useState, useEffect } from "react";
import "../styles/personal.css";

function Personal() {

  /* ===== SAFE LOCAL DATE ===== */
  const getLocalDate = (dateObj = new Date()) => {
    const local = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  };

  const today = getLocalDate();
  const token = localStorage.getItem("token");

  /* ===== STATES ===== */

  const [items, setItems] = useState([]);
  const [data, setData] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const [currentDate, setCurrentDate] = useState(today);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("yesno");
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(5);

  /* ================= FETCH ITEMS ================= */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("https://life-tracker-backend-l5se.onrender.com/personal/items", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) return;

        const dbItems = await res.json();
        setItems(dbItems);

      } catch (err) {
        console.log("Fetch items error:", err);
      }
    };

    if (token) fetchItems();
  }, [token]);

  /* ================= FETCH VALUES ================= */
  useEffect(() => {
    const fetchValues = async () => {
      try {
        const res = await fetch("https://life-tracker-backend-l5se.onrender.com/personal", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) return;

        const dbData = await res.json();

        const formatted = {};
        dbData.forEach(entry => {
          if (!formatted[entry.date]) formatted[entry.date] = {};
          formatted[entry.date][entry.itemKey] = entry.value;
        });

        setData(formatted);

      } catch (err) {
        console.log("Fetch values error:", err);
      }
    };

    if (token) fetchValues();
  }, [token]);

  /* ================= SAVE VALUE ================= */
  const selectValue = async (key, value) => {
    try {
      await fetch("https://life-tracker-backend-l5se.onrender.com/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          itemKey: key,
          date: currentDate,
          value
        })
      });

      setData(prev => ({
        ...prev,
        [currentDate]: {
          ...prev[currentDate],
          [key]: value
        }
      }));

    } catch (err) {
      console.log("Save error:", err);
    }
  };

  /* ================= ADD ITEM ================= */
  const addItem = async () => {
    if (!newName.trim()) return;

    const key = newName.toLowerCase().replace(/\s+/g, "_");

    try {
      const res = await fetch("https://life-tracker-backend-l5se.onrender.com/personal/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          key,
          label: newName,
          type: newType,
          min: newType === "range" ? parseInt(minVal) : undefined,
          max: newType === "range" ? parseInt(maxVal) : undefined
        })
      });

      if (!res.ok) return;

      const savedItem = await res.json();
      setItems(prev => [...prev, savedItem]);

      setNewName("");
      setNewType("yesno");
      setMinVal(1);
      setMaxVal(5);
      setShowAdd(false);

    } catch (err) {
      console.log("Add item error:", err);
    }
  };

  /* ================= DELETE ITEM ================= */
  const deleteItem = async (key) => {
    try {
      await fetch(`https://life-tracker-backend-l5se.onrender.com/personal/items/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setItems(prev => prev.filter(i => i.key !== key));

    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  /* ================= SHADE ================= */
  const getShade = (value, max = 10) => {
    if (!value) return "#f3e6dc";
    const opacity = value / max;
    return `rgba(111,78,55,${opacity})`;
  };

  /* ================= CALENDAR ================= */
  const monthDate = new Date(currentDate);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (dir) => {
    const newMonthDate = new Date(year, month + dir, 1);
    setCurrentDate(getLocalDate(newMonthDate));
  };

  return (
    <div className="main-personal-wrapper">
      <div className="main-personal-container">

        <h3 className="main-personal-title">Personal</h3>

        {items.map(item => {
          const selectedValue = data[currentDate]?.[item.key];

          return (
            <div key={item.key} className="main-personal-block">

              <div
                className="main-personal-card"
                onClick={() =>
                  setActiveKey(activeKey === item.key ? null : item.key)
                }
              >
                <span>{item.label}</span>

                <button
                  className="main-personal-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.key);
                  }}
                >
                  🗑
                </button>
              </div>

              {activeKey === item.key && (
                <div className="main-personal-expand">

                  {item.type === "range" && (
                    <div className="number-row">
                      {Array.from({ length: item.max }, (_, i) => i + 1).map(num => (
                        <div
                          key={num}
                          className="number-circle"
                          style={{
                            background:
                              selectedValue === num
                                ? getShade(num, item.max)
                                : "#f3e6dc",
                            color: selectedValue === num ? "#fff" : "#000"
                          }}
                          onClick={() => selectValue(item.key, num)}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.type === "yesno" && (
                    <div className="yesno-row">
                      {["Yes", "No"].map(val => (
                        <div
                          key={val}
                          className="yesno-btn"
                          style={{
                            background:
                              selectedValue === val ? "#6f4e37" : "#f3e6dc",
                            color:
                              selectedValue === val ? "#fff" : "#000"
                          }}
                          onClick={() => selectValue(item.key, val)}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="calendar-header">
                    <button onClick={() => changeMonth(-1)}>◀</button>
                    <span>{year} - {month + 1}</span>
                    <button onClick={() => changeMonth(1)}>▶</button>
                  </div>

                  <div className="calendar-grid">
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const fullDate =
                        `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

                      const value = data[fullDate]?.[item.key];

                      return (
                        <div
                          key={day}
                          className="calendar-day"
                          style={{
                            background: item.type === "range"
                              ? getShade(value, item.max)
                              : value === "Yes"
                                ? "#6f4e37"
                                : value === "No"
                                  ? "#c7a17a"
                                  : "#f3e6dc",
                            color: value ? "#fff" : "#000"
                          }}
                          onClick={() => setCurrentDate(fullDate)}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>
          );
        })}

        <button
          className="main-personal-add-btn"
          onClick={() => setShowAdd(!showAdd)}
        >
          + Add
        </button>

        {showAdd && (
          <div className="main-personal-popup">
            <input
              placeholder="Item name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="yesno">Yes / No</option>
              <option value="range">Range</option>
            </select>

            {newType === "range" && (
              <>
                <input
                  type="number"
                  placeholder="Min"
                  value={minVal}
                  onChange={(e) => setMinVal(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxVal}
                  onChange={(e) => setMaxVal(e.target.value)}
                />
              </>
            )}

            <div className="popup-actions">
              <button onClick={addItem}>Add</button>
              <button onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Personal;