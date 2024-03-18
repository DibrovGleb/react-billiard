import * as React from "react";
import { useState } from "react";

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState("#ff0000");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <div>
      <input type="color" value={color} onChange={handleChange} />
    </div>
  );
};

export default ColorPicker;