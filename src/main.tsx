import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/styles/main.css";
import { SidebarProvider, VaultProvider } from "@/hooks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<SidebarProvider>
			<VaultProvider>
				<App />
			</VaultProvider>
		</SidebarProvider>
	</React.StrictMode>,
);
