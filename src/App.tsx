import "@/styles/main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Onboard, Dashboard } from "@/pages";
import Filetree from "@/components/Filetree";

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
]);

function App() {
	return (
		<div className="flex">
			<Sidebar />
			<Filetree />
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
