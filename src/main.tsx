import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/styles/main.css";
import {
  FiletreeProvider,
  VaultProvider,
  SettingsProvider,
  ContextMenuProvider,
} from "@/hooks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FiletreeProvider>
      <SettingsProvider>
        <VaultProvider>
          <ContextMenuProvider>
            <App />
          </ContextMenuProvider>
        </VaultProvider>
      </SettingsProvider>
    </FiletreeProvider>
  </React.StrictMode>,
);
