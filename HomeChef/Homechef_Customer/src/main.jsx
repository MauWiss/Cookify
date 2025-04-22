import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // שים לב שהחלפנו ל-HashRouter
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/cgroup82/tar1">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
