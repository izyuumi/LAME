import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Command as CommandJSX } from "cmdk";
import { useHotkeys } from "react-hotkeys-hook";
import Kbd from "@/components/common/Kbd";
import { KeymapIdentifier } from "@/hooks";

/**
 * The interfaces that exist in the application
 * Used to determine the commands that could be involked at a given moment
 *
 * @see useCmdk
 */
type InterfaceContext =
  | "cmdk"
  | "settings"
  | "filetree"
  | "vault-prompt"
  | "editor"
  | "onboarding";

/**
 * The command to be registered in the command menu
 * @see useCmdk
 */
export interface Command {
  /**
   * The label to display in the command menu
   * @example "New File"
   */
  label: string;
  /**
   * The key default combination to invoke the command
   * @example "Mod+k"
   */
  key: string;
  /**
   * Whether the command is disabled
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Contexts in which the command is enabled
   * It is overridden by `disabledOn`
   *
   * @default undefined
   * @example ["cmdk", "editor"]
   *
   * @type {InterfaceContext[]}
   */
  enableOn?: InterfaceContext[];
  /**
   * Contexts in which the command is disabled
   * It overrides `enableOn`
   *
   * @default undefined
   * @example ["filetree", "settings"]
   *
   * @type {InterfaceContext[]}
   */
  disabledOn?: InterfaceContext[];
  /**
   * Whether to hide the command from the command menu
   *
   * @default false
   */
  hideOnCommandMenu?: boolean;
  /**
   * The action to be performed when the command is invoked
   */
  action: () => void | Promise<void>;
}

interface CmdkContextType {
  cmdkIsOpen: boolean;
  openCmdk: () => void;
  closeCmdk: () => void;
  setCmdkIsOpen: (isOpen: boolean) => void;
  cmdkCommands: Record<KeymapIdentifier, Command>;
  addCmdkCommand: (id: KeymapIdentifier, command: Command) => void;
  findCmdkCommand: (id: KeymapIdentifier) => Command | undefined;
  updateCmdkCommandShortcut: (id: KeymapIdentifier, key: string) => void;
  interfaceContext: InterfaceContext;
  setInterfaceContext: (context: InterfaceContext) => void;
}

const CmdkContext = createContext<CmdkContextType | null>(null);

const CmdkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Record<string, Command>>({});
  const [currentInterface, setCurrentInterface] =
    useState<InterfaceContext>("filetree");

  const openCmdk: Command = {
    key: "Mod+k",
    label: "Open Command Menu",
    hideOnCommandMenu: true,
    action: () => {
      setIsOpen(true);
      setCurrentInterface("cmdk");
    },
  };

  const addCommand = (id: string, command: Command) => {
    setCommands((prevCommands) => ({
      ...prevCommands,
      [id]: command,
    }));
  };

  const findCommand = (id: string) => commands[id];

  const updateCmdkCommandShortcut = (id: KeymapIdentifier, key: string) =>
    setCommands((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        key,
      },
    }));

  useEffect(() => {
    addCommand("cmdk", openCmdk);
  }, []);

  const value: CmdkContextType = useMemo(
    () => ({
      cmdkIsOpen: isOpen,
      openCmdk: () => setIsOpen(true),
      closeCmdk: () => setIsOpen(false),
      setCmdkIsOpen: (isOpen: boolean) => setIsOpen(isOpen),
      cmdkCommands: commands,
      addCmdkCommand: addCommand,
      updateCmdkCommandShortcut,
      findCmdkCommand: findCommand,
      interfaceContext: currentInterface,
      setInterfaceContext: setCurrentInterface,
    }),
    [isOpen, commands, currentInterface]
  );

  return (
    <CmdkContext.Provider value={value}>
      {children}
      <CommandKMenu />
      {Object.entries(commands).map(([id, command]) => (
        <CommandComponent
          key={id}
          command={command}
          currentInterface={currentInterface}
        />
      ))}
    </CmdkContext.Provider>
  );
};

const CommandComponent = ({
  command,
  currentInterface,
}: {
  command: Command;
  currentInterface: InterfaceContext;
}) => {
  useHotkeys(
    command.key,
    () => {
      if (command.disabled) return;
      if (command.disabledOn?.includes(currentInterface)) return;
      if (command.enableOn && !command.enableOn.includes(currentInterface))
        return;
      if (currentInterface === "cmdk") return;
      command.action();
    },
    {
      preventDefault: true,
    },
    [command, currentInterface]
  );
  return null;
};

const CommandKMenu = () => {
  const { cmdkIsOpen, setCmdkIsOpen, cmdkCommands } = useCmdk();

  return (
    <>
      {cmdkIsOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30" />
      )}
      <CommandJSX.Dialog
        open={cmdkIsOpen}
        onOpenChange={setCmdkIsOpen}
        label="Command Menu"
        className="fixed left-1/2 top-40 z-50 w-96 max-w-full -translate-x-1/2 transform overflow-x-hidden overflow-y-auto bg-black p-2 shadow-lg border-primary border border-solid"
        loop
      >
        <CommandJSX.Input
          placeholder="Search for a command..."
          className="mb-2 w-full bg-transparent p-2 focus:outline-none"
        />
        <CommandJSX.List>
          <CommandJSX.Empty className="p-2">No results found.</CommandJSX.Empty>
          {Object.entries(cmdkCommands).map(
            ([id, command]) =>
              !command.hideOnCommandMenu && (
                <CommandKMenuItem key={id} command={command} />
              )
          )}
        </CommandJSX.List>
      </CommandJSX.Dialog>
    </>
  );
};

const CommandKMenuItem = ({ command }: { command: Command }) => {
  const { closeCmdk } = useCmdk();

  const closeCmdkAndInvoke = () => {
    closeCmdk();
    setTimeout(() => {
      command.action();
    }, 50);
  };

  useHotkeys(
    command.key,
    () => {
      if (command.disabled) return;
      if (command.disabledOn?.includes("cmdk")) return;
      closeCmdkAndInvoke();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA"],
    }
  );

  return (
    <CommandJSX.Item
      onSelect={closeCmdkAndInvoke}
      className="cursor-pointer rounded-md p-2 hover:bg-gray-800 aria-selected:bg-gray-800"
    >
      <div className="flex justify-between items-center">
        <p>{command.label}</p>
        <div>
          {command.key.split("+").map((key) => (
            <Kbd key={key} k={key} />
          ))}
        </div>
      </div>
    </CommandJSX.Item>
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
