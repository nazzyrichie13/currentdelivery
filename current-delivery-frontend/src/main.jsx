import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ScrollToTop from "./component/ScrollToTop";
import "./i18n"; // ✅ MUST come before App renders

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
