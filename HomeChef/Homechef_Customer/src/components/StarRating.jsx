// components/StarRating.jsx
import React from "react";
import ReactStars from "react-rating-stars-component";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const StarRating = ({ value = 0, onChange = () => {}, edit = true }) => {
  const token = localStorage.getItem("token");

  const handleChange = (newValue) => {
    if (!token) {
      toast.info("Please login to rate ⭐");
      return;
    }
    onChange(newValue);
  };

  return (
    <div className="flex items-center">
      <ReactStars
        count={5}
        value={value}
        onChange={handleChange}
        size={28}
        isHalf={false}           // ← only full stars
        edit={edit}
        emptyIcon={<FaRegStar />}      // outline star when value < index - 0.5
        halfIcon={<FaStarHalfAlt />}   // half‑filled star when index - 0.5 ≤ value < index
        filledIcon={<FaStar />}        // filled star when value ≥ index
        color="#d1d5db"                // empty star color (gray‑300)
        activeColor="#facc15"          // filled star color (yellow‑400)
      />
    </div>
  );
};

export default StarRating;
