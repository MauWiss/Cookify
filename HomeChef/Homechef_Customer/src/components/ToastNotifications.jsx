import React from "react";
import { ToastContainer } from "react-toastify"; // Toastify to show notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const ToastNotifications = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastNotifications;
