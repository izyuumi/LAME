import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/styles/main.css";
import {
  FiletreeProvider,
  VaultProvider,
  SettingsProvider,
  ContextMenuProvider,
  CmdkProvider,
  ConfigProvider,
} from "@/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CmdkProvider>
        <ConfigProvider>
          <FiletreeProvider>
            <SettingsProvider>
              <VaultProvider>
                <ContextMenuProvider>
                  <App />
                </ContextMenuProvider>
              </VaultProvider>
            </SettingsProvider>
          </FiletreeProvider>
        </ConfigProvider>
      </CmdkProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
