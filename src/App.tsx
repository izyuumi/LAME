import "./styles.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Menu } from "@/components/Menu";
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
    path: "/dashboard/:vaultid",
    element: <Dashboard />,
  },
]);

function App() {
  return (
    <div className="flex">
      <Menu /> {/* TODO: hide when onboarding */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
