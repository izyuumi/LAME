import React, {
  RefObject,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useCmdk } from "@/hooks";

interface SettingsContext {
  settingsRef: RefObject<HTMLDialogElement>;
  openSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContext | null>(null);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const settingsRef = useRef<HTMLDialogElement>(null);
  const { addCmdkCommand, setInterfaceContext } = useCmdk();

  const open = () => {
    settingsRef.current?.showModal();
    setInterfaceContext("settings");
    const firstFocusable = settingsRef.current?.querySelector(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    ) as HTMLElement;
    firstFocusable?.blur();
  };
  const close = () => settingsRef.current?.close();

  useEffect(() => {
    addCmdkCommand("settings", {
      label: "Settings",
      key: "Mod+comma",
      disabledOn: ["settings"],
      action: open,
    });
  }, []);

  const value = useMemo(
    () => ({
      settingsRef,
      openSettings: open,
      closeSettings: close,
    }),
    [settingsRef]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Hook to access the settings context
 * @returns {SettingsContext}
 * @throws {Error} if used outside of a SettingsProvider
 */
const useSettings = (): SettingsContext => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export { useSettings, SettingsProvider };
