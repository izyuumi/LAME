import "./styles.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Menu } from "@/components/Menu";
import { Home, Onboard, Dashboard } from "@/pages";

const router = createBrowserRouter([
  {
    index: true,
    element: <Home />,
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
      <Menu />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
