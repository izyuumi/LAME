import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Command } from "cmdk";
import { useVault } from "./useVault";

interface Command {
  label: string;
  action: () => void;
}

interface CmdkContextType {
  cmdkIsOpen: boolean;
  openCmdk: () => void;
  closeCmdk: () => void;
  setCmdkIsOpen: (isOpen: boolean) => void;
  cmdkCommands: Record<string, Command>;
  addCmdkCommand: (id: string, command: Command) => void;
  addCmdkCommands: (commands: Record<string, Command>) => void;
}

const CmdkContext = createContext<CmdkContextType | null>(null);

const CmdkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Record<string, Command>>({});

  const { currentVaultPath } = useVault();

  const keydown = (e: KeyboardEvent) => {
    if (!currentVaultPath) return;
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [currentVaultPath]);

  const addCommand = (id: string, command: Command) => {
    setCommands((prevCommands) => ({
      ...prevCommands,
      [id]: command,
    }));
  };

  const addCommands = (commands: Record<string, Command>) => {
    setCommands((prevCommands) => ({
      ...prevCommands,
      ...commands,
    }));
  };

  const value: CmdkContextType = useMemo(
    () => ({
      cmdkIsOpen: isOpen,
      openCmdk: () => setIsOpen(true),
      closeCmdk: () => setIsOpen(false),
      setCmdkIsOpen: (isOpen: boolean) => setIsOpen(isOpen),
      cmdkCommands: commands,
      addCmdkCommand: addCommand,
      addCmdkCommands: addCommands,
    }),
    [isOpen, commands],
  );

  return (
    <CmdkContext.Provider value={value}>
      {children}
      <CommandKMenu />
    </CmdkContext.Provider>
  );
};

const CommandKMenu = () => {
  const { cmdkIsOpen, closeCmdk, setCmdkIsOpen, cmdkCommands } = useCmdk();
  return (
    <>
      {cmdkIsOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30" />
      )}
      <Command.Dialog
        open={cmdkIsOpen}
        onOpenChange={setCmdkIsOpen}
        label="Command Menu"
        className="fixed left-1/2 top-40 z-50 w-96 max-w-full -translate-x-1/2 transform overflow-hidden rounded-lg bg-black p-2 shadow-lg"
        loop
      >
        <Command.Input
          placeholder="Search for a command..."
          className="mb-2 w-full bg-transparent p-2 focus:outline-none"
        />
        <Command.List>
          <Command.Empty className="p-2">No results found.</Command.Empty>
          {Object.entries(cmdkCommands).map(([id, command]) => (
            <Command.Item
              key={id}
              onSelect={() => {
                closeCmdk();
                setTimeout(() => {
                  command.action();
                }, 50);
              }}
              className="cursor-pointer rounded-md p-2 hover:bg-gray-800 aria-selected:bg-gray-800"
            >
              {command.label}
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
};

/**
 * Hook to access the cmdk context
 * @returns {CmdkContext}
 * @throws {Error} if used outside of a CmdkProvider
 */
const useCmdk = (): CmdkContextType => {
  const context = useContext(CmdkContext);
  if (!context) {
    throw new Error("useCmdk must be used within a CmdkProvider");
  }
  return context;
};

export { useCmdk, CmdkProvider };
