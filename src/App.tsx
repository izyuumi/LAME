import "@/styles/main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Onboard, Dashboard, Login } from "@/pages";
import Filetree from "@/components/Filetree";
import Settings from "@/components/settings";
import { themeChange } from "theme-change";
import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useFiletree } from "./hooks";

const router = createBrowserRouter([
	{
		index: true,
		element: <Onboard />, // TODO: check whether user was in a vault
	},
	{
		path: "/onboarding",
		element: <Onboard />,
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

function App() {
	const { closeFiletree, openFiletree } = useFiletree();

	useEffect(() => {
		themeChange(false);
	}, []);

	return (
		<PanelGroup direction="horizontal" className="h-full flex">
			<Sidebar />
			<Panel
				collapsible
				defaultSize={14}
				collapsedSize={0}
				minSize={10}
				maxSize={30}
				onCollapse={closeFiletree}
				onExpand={openFiletree}
				className="flex-1"
			>
				<Filetree />
			</Panel>
			<PanelResizeHandle className="w-1 bg-black focus:outline-none focus:bg-blue-500" />
			<Panel>
				<RouterProvider router={router} />
			</Panel>
			<Settings />
		</PanelGroup>
	);
}

export default App;
