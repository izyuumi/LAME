import "@/styles/main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Onboard, Dashboard } from "@/pages";

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
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
