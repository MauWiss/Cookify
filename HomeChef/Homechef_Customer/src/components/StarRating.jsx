import React, { useState } from "react";

/**
 * A simple 5‑star rating component with hover & click support.
 *
 * value: number (0–5)
 * onChange: function(newRating)
 * edit: boolean (if false, clicking & hover are disabled)
 */
const StarRating = ({ value = 0, onChange = () => {}, edit = true }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = hoverValue >= i || (!hoverValue && value >= i);
        return (
          <span
            key={i}
            className={`select-none text-2xl cursor-pointer ${
              fill ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => edit && onChange(i)}
            onMouseEnter={() => edit && setHoverValue(i)}
            onMouseLeave={() => edit && setHoverValue(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
