import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { SidebarProvider } from "@/hooks/useSidebar";
import { VaultProvider } from "./hooks/useVault";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<SidebarProvider>
			<VaultProvider>
				<App />
			</VaultProvider>
		</SidebarProvider>
	</React.StrictMode>,
);
