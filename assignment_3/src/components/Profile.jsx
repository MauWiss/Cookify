import React, { useState, useEffect } from "react";
import {
  MdOutlineMailOutline,
  MdLocationOn,
  MdDateRange,
} from "react-icons/md";

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Retrieve the logged-in user's data from sessionStorage
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setUserData(JSON.parse(loggedInUser));
    }
  }, []);

  if (!userData) {
    return <p>Please log in to view your profile.</p>;
  }
  console.log("Image Data:", userData.image);

  return (
    <div className="userBlock">
      <div className="userData">
        <div className="userImage">
          {userData.image ? (
            <img
              src={userData.image} // Base64 string or URL
              alt="User"
              style={{ maxWidth: "100px", borderRadius: "50%" }}
            />
          ) : (
            <p>No Image Available</p>
          )}
        </div>
        <div className="userInfo">
          <p className="userName">
            {userData.firstName} {userData.lastName}
          </p>
          <p>
            <MdOutlineMailOutline /> {userData.email}
          </p>
          <p>
            <MdLocationOn /> {userData.street} {userData.number},{" "}
            {userData.city}
          </p>
          <p>
            <MdDateRange /> {userData.birthDate}
          </p>
        </div>
      </div>
      <div className="userActions">
        <button>Log Out</button>
        <button>Edit</button>
        <button>Favorite Game</button>
      </div>
    </div>
  );
}
