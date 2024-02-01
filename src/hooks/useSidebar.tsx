import React, { createContext, useContext, useMemo, useState } from "react";

interface SidebarContext {
	sidebarIsOpen: boolean;
	toggleSidebar: () => void;
	openSidebar: () => void;
	closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContext | null>(null);

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
	const toggleSidebar = () => setSidebarIsOpen((prev) => !prev);
	const openSidebar = () => setSidebarIsOpen(true);
	const closeSidebar = () => setSidebarIsOpen(false);

	const value = useMemo(
		() => ({
			sidebarIsOpen,
			toggleSidebar,
			openSidebar,
			closeSidebar,
		}),
		[sidebarIsOpen],
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
