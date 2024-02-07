import { useSettings } from "@/hooks/useSettings";
import SettingsShortcuts from "./SettingsShortcuts";
import { useState } from "react";

interface SettingsPage {
  [key: string]: React.ReactNode;
}

const settingsPages: SettingsPage = {
  general: "General",
  shortcuts: <SettingsShortcuts />,
} as const;

function Settings() {
  const { settingsRef } = useSettings();

  const [currentPage, setCurrentPage] =
    useState<keyof typeof settingsPages>("general");

  return (
    <dialog ref={settingsRef} className="modal">
      <div className="modal-box flex">
        <ul className="flex flex-col items-start">
          {Object.keys(settingsPages).map((page) => (
            <li
              key={page}
              className="hover:bg-white hover:bg-opacity-10 w-full p-2 rounded-md"
            >
              <button
                onClick={() =>
                  setCurrentPage(page as keyof typeof settingsPages)
                }
              >
                {camelCaseToSentenceCase(page)}
              </button>
            </li>
          ))}
        </ul>
        <div className="divider divider-horizontal" />
        <div>{settingsPages[currentPage]}</div>
      </div>
    </dialog>
  );
}

export default Settings;

const camelCaseToSentenceCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
