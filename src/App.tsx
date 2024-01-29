import React, { ReactNode, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./styles.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";

type Page = {
  path: string;
  component: ReactNode;
};

const pages: Page[] = [
  {
    path: "/",
    component: <div>Home</div>,
  },
  {
    path: "/about",
    component: <div>About</div>,
  },
];

function App() {
  const [openTab, setOpenTab] = useState(true);

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <div>
      <Router>
        <Routes>
          {pages.map((page) => (
            <Route path={page.path} element={page.component} />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
