import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/styles/main.css";
import { SidebarProvider, VaultProvider } from "@/hooks";
import { SettingsProvider } from "./hooks/useSettings";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<SidebarProvider>
			<SettingsProvider>
				<VaultProvider>
					<App />
				</VaultProvider>
			</SettingsProvider>
		</SidebarProvider>
	</React.StrictMode>,
);
