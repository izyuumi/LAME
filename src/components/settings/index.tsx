import { useSettings } from "@/hooks";
import SettingsShortcuts from "./SettingsShortcuts";
import { useState } from "react";
import SettingsGeneral from "./SettingsGeneral";

interface SettingsPage {
  [key: string]: React.ReactNode;
}

const settingsPages: SettingsPage = {
  general: <SettingsGeneral />,
  shortcuts: <SettingsShortcuts />,
} as const;

function Settings() {
  const { settingsRef } = useSettings();

  const [currentPage, setCurrentPage] =
    useState<keyof typeof settingsPages>("general");

  return (
    <dialog ref={settingsRef} className="modal">
      <div className="modal-box border-primary flex h-96 max-h-full border border-solid">
        <ul className="flex flex-col items-start gap-2">
          {Object.keys(settingsPages).map((page) => (
            <li key={page} className="w-full">
              <button
                className="btn btn-ghost h-full w-full rounded-md"
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
        <div className="preview h-full w-full overflow-auto">
          {settingsPages[currentPage]}
        </div>
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
