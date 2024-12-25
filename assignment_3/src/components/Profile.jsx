import React, { useState, useEffect } from "react";
import {
  MdOutlineMailOutline,
  MdLocationOn,
  MdDateRange,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the logged-in user's data from sessionStorage
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setUserData(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogOut = () => {
    sessionStorage.removeItem("loggedInUser"); // Remove user from sessionStorage
    console.log("User logged out."); // Debug log
    navigate("/Login"); // Redirect to Login page
  };

  if (!userData) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <form className="card mx-auto">
      <div className="card-body">
        <div className="userImage">
          {userData.image ? (
            <img
              src={userData.image} // Base64 string or URL
              alt="User"
              style={{ maxWidth: "200px", borderRadius: "10%" }}
            />
          ) : (
            <p>No Image Available</p>
          )}
        </div>
        <div className="userInfo">
          <p className="fs-2">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="fs-5">
            <MdOutlineMailOutline /> {userData.email}
          </p>
          <p className="fs-5">
            <MdLocationOn /> {userData.street} {userData.number},{" "}
            {userData.city}
          </p > 
          <p className="fs-5">
            <MdDateRange /> {userData.birthDate}
          </p>
        </div>
      </div>
      <div className="btn-group" role="group">
        <button
          onClick={() => window.open("https://www.falafelgame.com/", "_blank")}
          className="btn btn-success m-1"
        >
          Favorite Game
        </button>
        <button
          onClick={() => navigate("/EditProfile")}
          className="btn btn-primary m-1"
        >
          Edit
        </button>

        <button
          className="btn btn-danger m-1"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            handleLogOut();
          }}
        >
          Log Out
        </button>
      </div>
    </form>
  );
}
