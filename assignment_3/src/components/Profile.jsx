import React, { useState, useEffect } from "react";
import {
  MdOutlineMailOutline,
  MdLocationOn,
  MdDateRange,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Profile(props) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

  return (
    <form className="card p-4">
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
      <div className="btn-group" role="group" >
        <button className="btn btn-primary  m-1 "
          onClick={() => {
            props.logOutUser();
          }}
        >
          Log Out
        </button>
        <button onClick={() => navigate("/EditProfile")} className="btn btn-primary m-1">Edit</button>
        <button
          onClick={() => window.open("https://www.falafelgame.com/", "_blank")}
          className="btn btn-primary  m-1">
          Favorite Game
        </button>
      </div>
    </form>
  );
}
