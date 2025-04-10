import React from "react";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";

const StarRating = ({
  value = 0,
  onChange = () => {},
  size = 28,
  editable = true,
}) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleChange = (newValue) => {
    if (!isLoggedIn) {
      toast.info("Please login to rate ⭐");
      return;
    }
    onChange(newValue);
  };

  return (
    <div className="flex cursor-pointer flex-col items-start text-yellow-500">
      <ReactStars
        count={5}
        value={value}
        onChange={handleChange}
        size={size}
        isHalf={true}
        edit={editable}
        activeColor="#facc15" // yellow-400 for active color
        color="#e4e5e9" // gray color for unfilled stars
      />
    </div>
  );
};

export default StarRating;
