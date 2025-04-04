import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7019/api", // עדכן לפי כתובת השרת שלך
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
