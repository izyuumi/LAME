import { useVault } from "@/hooks";
import { type FileEntry, readDir } from "@tauri-apps/api/fs";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { twMerge as tm } from "tailwind-merge";
import { watch } from "tauri-plugin-fs-watch-api";
import TitlebarSpace from "@/components/TaskbarSpace";
import {
  ContextMenuWrapper,
  ContextMenuItem,
} from "./Common/ContextMenuWrapper";

function Filetree() {
  const { currentVaultPath } = useVault();

  const [filetree, setFiletree] = useState<FileEntry[]>([]);
  const filetreeRef = useRef<HTMLUListElement>(null);

  const watchForFileChanges = async (path: string) => {
    await watch(
      [path],
      async () => {
        await getDirectoryContents(path);
      },
      {
        recursive: true,
      },
    );
  };

  const getDirectoryContents = async (path: string | null) => {
    if (!path) return;
    const files = await readDir(path, { recursive: true });
    files.sort((a, b) => {
      if (a.children && b.children) {
        if (a.name === b.name) return 0;
        if (!a.name) return -1;
        if (!b.name) return 1;
        return a.name.localeCompare(b.name);
      }
      if (a.children && !b.children) return -1;
      if (!a.children && b.children) return 1;
      if (a.name === b.name) return 0;
      if (!a.name) return -1;
      if (!b.name) return 1;
      return a.name.localeCompare(b.name);
    });
    setFiletree(files);
  };

  useEffect(() => {
    getDirectoryContents(currentVaultPath);
    if (currentVaultPath) {
      watchForFileChanges(currentVaultPath);
    }
  }, [currentVaultPath]);

  return (
    <div className="bg-base-300 h-screen">
      <TitlebarSpace />
      <ul
        ref={filetreeRef}
        className={tm(
          "bg-base-300 flex w-[150px] select-none flex-col p-1",
          !currentVaultPath && "hidden",
        )}
      >
        {filetree.map(
          (file) =>
            !file.name?.startsWith(".") &&
            file.name !== "conf.lame" && (
              <FiletreeItem key={file.path} {...file} />
            ),
        )}
      </ul>
    </div>
  );
}

export default Filetree;

const FiletreeItem = ({ name, path, children }: FileEntry) => {
  const { openPath, openedPath } = useVault();
  const [isOpen, setIsOpen] = useState(false);
  const isDirectory = children !== undefined;

  const [itemContextMenuPosition, setItemContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showItemContextMenu, setShowItemContextMenu] = useState(false);
  const [directoryContextMenuPosition, setDirectoryContextMenuPosition] =
    useState({
      x: 0,
      y: 0,
    });
  const [showDirectoryContextMenu, setShowDirectoryContextMenu] =
    useState(false);

  const directoryContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDirectoryContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowDirectoryContextMenu(true);
  };

  const fileContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setItemContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowItemContextMenu(true);
  };

  const FiletreeDirectoryContextMenu = () => {
    return (
      <ContextMenuWrapper
        position={directoryContextMenuPosition}
        show={showDirectoryContextMenu}
        setShow={setShowDirectoryContextMenu}
      >
        <ContextMenuItem onClick={() => console.log("New File")}>
          New File
        </ContextMenuItem>
        <ContextMenuItem onClick={() => console.log("New Folder")}>
          New Folder
        </ContextMenuItem>
      </ContextMenuWrapper>
    );
  };

  const FiletreeItemContextMenu = () => {
    return (
      <ContextMenuWrapper
        position={itemContextMenuPosition}
        show={showItemContextMenu}
        setShow={setShowItemContextMenu}
      >
        <ContextMenuItem onClick={() => console.log("Open")}>
          Open
        </ContextMenuItem>
        <ContextMenuItem onClick={() => console.log("Rename")}>
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => console.log("Delete")}>
          Delete
        </ContextMenuItem>
      </ContextMenuWrapper>
    );
  };

  return (
    <>
      <li className="ml-2">
        <button
          onClick={() =>
            isDirectory ? setIsOpen((prev) => !prev) : openPath(path)
          }
          onContextMenu={isDirectory ? directoryContextMenu : fileContextMenu}
          className={tm(
            "flex w-full items-center",
            openedPath === path && "text-[#0052ff]",
            !isDirectory && "ml-3",
          )}
        >
          {isDirectory &&
            (isOpen ? (
              <ChevronDown size={16} className="mr-1 opacity-40" />
            ) : (
              <ChevronRight size={16} className="mr-1 opacity-40" />
            ))}
          {name}
        </button>
        {isDirectory && (
          <ul>
            {children.map(
              (child) =>
                !child.name?.startsWith(".") && (
                  <span key={child.path} className={isOpen ? "" : "hidden"}>
                    <FiletreeItem {...child} />
                  </span>
                ),
            )}
          </ul>
        )}
      </li>
      {isDirectory
        ? showDirectoryContextMenu && <FiletreeDirectoryContextMenu />
        : showItemContextMenu && <FiletreeItemContextMenu />}
    </>
  );
};
