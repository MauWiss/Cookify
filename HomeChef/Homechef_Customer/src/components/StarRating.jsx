import React from "react";
import ReactStars from "react-rating-stars-component";

const StarRating = ({ value = 0, onChange = () => {}, editable = true }) => {
  const handleChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-start text-yellow-500">
      <ReactStars
        count={5}
        value={value}
        onChange={handleChange}
        size={28}
        isHalf={true}
        edit={editable}
        activeColor="#facc15"
      />
    </div>
  );
};

export default StarRating;
