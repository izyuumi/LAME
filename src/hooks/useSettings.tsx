import React, {
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";

interface SettingsContext {
  settingsRef: RefObject<HTMLDialogElement>;
  openSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContext | null>(null);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const settingsRef = useRef<HTMLDialogElement>(null);
  const open = () => {
    settingsRef.current?.showModal();
    let firstFocusable = settingsRef.current?.querySelector(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    ) as HTMLElement;
    firstFocusable?.blur();
  };
  const close = () => settingsRef.current?.close();

  const value = useMemo(
    () => ({
      settingsRef,
      openSettings: open,
      closeSettings: close,
    }),
    [settingsRef],
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
