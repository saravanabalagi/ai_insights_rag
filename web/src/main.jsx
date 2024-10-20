// @deno-types="@types/react"
import React from "react";
// @deno-types="@types/react-dom"
import { ConfigProvider, theme } from "antd";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas, far);

// Create a root and render the App component
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorTextPlaceholder: "#999",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
