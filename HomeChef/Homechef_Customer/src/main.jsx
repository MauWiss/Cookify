import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter } from "react-router-dom"; // שים לב שהחלפנו ל-HashRouter
import "@fortawesome/fontawesome-free/css/all.min.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
