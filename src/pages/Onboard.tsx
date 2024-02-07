import { useEffect } from "react";
import { useSidebar, useVault } from "@/hooks";
import { open } from "@tauri-apps/api/dialog";
import { appWindow } from "@tauri-apps/api/window";
import { useNavigate } from "react-router-dom";

export function Onboard() {
  const { closeSidebar } = useSidebar();
  const { openVaultFromPath, currentVaultPath } = useVault();
  const navigate = useNavigate();

  useEffect(() => {
    closeSidebar();
  }, []);

  useEffect(() => {
    currentVaultPath && navigate("/dashboard");
  }, [currentVaultPath]);

  appWindow.listen("tauri://file-drop", async (event) => {
    if (Array.isArray(event.payload) && event.payload.length > 0) {
      await openVaultAndNavigate(event.payload[0]);
    }
  });

  const openVaultAndNavigate = async (path: string) => {
    await openVaultFromPath(path);
    navigate("/dashboard");
  };

  /**
   * Opens a file dialog to select a directory
   * @returns {Promise<void>}
   */
  const selectVault = async (): Promise<void> => {
    const selected = await open({
      title: "Select a vault",
      multiple: false,
      directory: true,
    });
    if (selected === null) return;
    if (Array.isArray(selected) && selected.length === 0) return;
    if (typeof selected === "string") {
      await openVaultAndNavigate(selected);
    } else {
      if (selected.length < 1) return;
      await openVaultAndNavigate(selected[0]);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
      <h1>Welcome to the LAME</h1>
      <p>
        <strong>L</strong>OL <strong>A</strong>nother <strong>M</strong>
        arkdown <strong>E</strong>ditor
      </p>
      <p>Drag and drop a directory to get started</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={selectVault}
      >
        Select directory
      </button>
    </div>
  );
}
