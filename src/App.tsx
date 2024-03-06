import "@/styles/main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Onboard, Dashboard } from "@/pages";
import Filetree from "@/components/Filetree";
import Settings from "@/components/settings";
import { themeChange } from "theme-change";
import { useEffect } from "react";

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
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="flex">
      <div className="flex">
        <Sidebar />
        <Filetree />
      </div>
      <RouterProvider router={router} />
      <Settings />
    </div>
  );
}

export default App;
