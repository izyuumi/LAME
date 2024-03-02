import React, { createContext, useContext, useMemo, useState } from "react";

interface FiletreeContextType {
  filetreeIsOpen: boolean;
  toggleFiletree: () => void;
  openFiletree: () => void;
  closeFiletree: () => void;
}

const FiletreeContext = createContext<FiletreeContextType | null>(null);

const FiletreeProvider = ({ children }: { children: React.ReactNode }) => {
  const [filetreeIsOpen, setFiletreeIsOpen] = useState(false);
  const toggleFiletree = () => setFiletreeIsOpen((prev) => !prev);
  const openFiletree = () => setFiletreeIsOpen(true);
  const closeFiletree = () => setFiletreeIsOpen(false);

  const value = useMemo(
    () => ({
      filetreeIsOpen,
      toggleFiletree,
      openFiletree,
      closeFiletree,
    }),
    [filetreeIsOpen]
  );

  return (
    <FiletreeContext.Provider value={value}>
      {children}
    </FiletreeContext.Provider>
  );
};

/**
 * Hook to access the filetree context
 * @returns {FiletreeContextType}
 * @throws {Error} if used filetree of a FiletreeProvider
 */
const useFiletree = (): FiletreeContextType => {
  const context = useContext(FiletreeContext);
  if (!context) {
    throw new Error("useFiletree must be used within a FiletreeProvider");
  }
  return context;
};

export { useFiletree, FiletreeProvider };
