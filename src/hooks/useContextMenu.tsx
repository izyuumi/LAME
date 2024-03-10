import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

interface ContextMenuOptions {
  side?: "left" | "right" | "top" | "bottom";
}

interface ContextMenuProps {
  contextMenuIsOpen: boolean;
  openContextMenu: (
    event: React.MouseEvent<HTMLElement>,
    anchorEl: HTMLElement | null,
    contextChildren: React.ReactNode,
    options?: ContextMenuOptions,
  ) => void;
  closeContextMenu: () => void;
  contextMenuAnchorEl: HTMLElement | null;
  contextMenuChildren: React.ReactNode;
  contextMenuOptions: ContextMenuOptions;
}

const ContextMenuContext = createContext<ContextMenuProps | null>(null);

const ContextMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [contextMenuAnchorEl, setContextMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [contextMenuChildren, setContextMenuChildren] =
    useState<React.ReactNode>();
  const [contextMenuOptions, setContextMenuOptions] =
    useState<ContextMenuOptions>({});

  const openContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    anchorEl: HTMLElement | null,
    contextChildren?: React.ReactNode,
    contextMenuOptions?: ContextMenuOptions,
  ) => {
    event.preventDefault();
    if (anchorEl === null) return;
    setContextMenuAnchorEl(anchorEl);
    setContextMenuChildren(contextChildren);
    setContextMenuIsOpen(true);
    setContextMenuOptions(contextMenuOptions || {});
  };

  const closeContextMenu = () => {
    setContextMenuIsOpen(false);
    setContextMenuChildren(undefined);
    setContextMenuAnchorEl(null);
    setContextMenuOptions({});
  };

  const value = useMemo(
    () => ({
      contextMenuIsOpen,
      openContextMenu,
      closeContextMenu,
      contextMenuAnchorEl,
      contextMenuChildren,
      contextMenuOptions,
    }),
    [
      contextMenuIsOpen,
      contextMenuAnchorEl,
      contextMenuChildren,
      contextMenuOptions,
    ],
  );

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
      <ContextMenuWrapper />
    </ContextMenuContext.Provider>
  );
};

const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return context;
};

export { useContextMenu, ContextMenuProvider, ContextMenuItem };

const ContextMenuWrapper = () => {
  const {
    contextMenuIsOpen,
    closeContextMenu: close,
    contextMenuAnchorEl,
    contextMenuChildren,
    contextMenuOptions,
  } = useContextMenu();
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  if (!contextMenuAnchorEl || !contextMenuIsOpen) return null;

  const anchorRect = contextMenuAnchorEl.getBoundingClientRect();

  const position = () => {
    const side = contextMenuOptions.side || "right";
    switch (side) {
      case "left":
        return {
          left: anchorRect.left,
          top: anchorRect.top,
        };
      case "right":
        return {
          left: anchorRect.right,
          top: anchorRect.top,
        };
      case "top":
        return {
          left: anchorRect.left,
          top: anchorRect.top,
        };
      case "bottom":
        return {
          left: anchorRect.left,
          top: anchorRect.bottom,
        };
    }
  };

  return (
    <div
      ref={contextMenuRef}
      className="flex flex-col items-start rounded-md bg-gray-500 p-3"
      style={{
        position: "fixed",
        ...position(),
      }}
    >
      {contextMenuChildren}
    </div>
  );
};

const ContextMenuItem = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      className={twMerge("", className)}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
};
