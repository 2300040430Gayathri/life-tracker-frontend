import { useRef } from "react";

function LongPressWrapper({ children, onLongPress }) {
  const timer = useRef(null);

  // 📱 Mobile long press
  const startPress = () => {
    timer.current = setTimeout(onLongPress, 600);
  };

  const stopPress = () => {
    clearTimeout(timer.current);
  };

  // 💻 Laptop double click
  const handleDoubleClick = () => {
    onLongPress();
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}   // 💻 desktop
      onTouchStart={startPress}           // 📱 mobile
      onTouchEnd={stopPress}
      onTouchCancel={stopPress}
    >
      {children}
    </div>
  );
}

export default LongPressWrapper;