import React from "react";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";

const StarRating = ({ value = 0, onChange = () => {}, editable = true }) => {
  const token = localStorage.getItem("token");

  const handleChange = (newValue) => {
    if (!token) {
      toast.info("Please login to rate ⭐");
      return;
    }
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
