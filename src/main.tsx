import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/styles/main.css";
import {
  SidebarProvider,
  VaultProvider,
  SettingsProvider,
  ContextMenuProvider,
} from "@/hooks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SidebarProvider>
      <SettingsProvider>
        <VaultProvider>
          <ContextMenuProvider>
            <App />
          </ContextMenuProvider>
        </VaultProvider>
      </SettingsProvider>
    </SidebarProvider>
  </React.StrictMode>,
);
