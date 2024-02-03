import React, { createContext, useContext, useMemo, useState } from "react";

type SidebarState = "closed" | "opened" | "minimized";

interface SidebarContext {
	sidebarIsOpen: SidebarState;
	toggleSidebar: () => void;
	openSidebar: () => void;
	closeSidebar: () => void;
	minimizeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContext | null>(null);

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const [sidebarStatus, setSidebarStatus] = useState<SidebarState>("closed");
	const toggleSidebar = () =>
		setSidebarStatus((prev) => {
			switch (prev) {
				case "closed":
					return "opened";
				case "opened":
					return "minimized";
				case "minimized":
					return "closed";
			}
		});
	const openSidebar = () => setSidebarStatus("opened");
	const closeSidebar = () => setSidebarStatus("closed");
	const minimizeSidebar = () => setSidebarStatus("minimized");

	const value = useMemo(
		() => ({
			sidebarIsOpen: sidebarStatus,
			toggleSidebar,
			openSidebar,
			closeSidebar,
			minimizeSidebar,
		}),
		[sidebarStatus],
	);

	return (
		<SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
	);
};

/**
 * Hook to access the sidebar context
 * @returns {SidebarContext}
 * @throws {Error} if used outside of a SidebarProvider
 */
const useSidebar = (): SidebarContext => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};

export { useSidebar, SidebarProvider };
