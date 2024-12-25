import React, { useEffect, useState } from 'react';

function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);


  useEffect(() => {

    const loggedIn = sessionStorage.getItem('loggedInUser') !== null;
    const user = sessionStorage.getItem('loggedInUser');
    setIsLoggedIn(loggedIn);

  }, []);

  if (!isLoggedIn) {
    return <div>Please Login</div>;
  }

  return (
    <div>

      <h2>Profile</h2>

      <div >
        <h3>{userInfo.username}</h3>
        <p>{userInfo.email}</p>
        <p>{userInfo.age}</p>
        <p>{userInfo.birthDate}</p>
      </div>

    </div>
  );
}

export default Profile;