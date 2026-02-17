import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ScrollToTop from "./component/ScrollToTop";
import "./i18n"; // ✅ initialize i18next first

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<div>Loading translations...</div>}>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </Suspense>
);
