// src/hooks/useNotifications.js
import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const useNotifications = (onReceive) => {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7019/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("token"), 
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        console.log(localStorage.getItem("token"));
        connection.on("ReceiveNotification", (data) => {
          console.log("Notification received:", data);
          onReceive(data); // תפעיל את הפונקציה שהועברה כפרופס
        });
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      connection.stop();
    };
  }, [onReceive]);
};

export default useNotifications;
