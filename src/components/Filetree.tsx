import { ContextMenuItem, useCmdk, useVault, useContextMenu } from "@/hooks";
import {
  type FileEntry,
  readDir,
  writeTextFile,
  exists,
  createDir,
} from "@tauri-apps/api/fs";
import { ChevronDown, ChevronRight, FilePlus, FolderPlus } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { twMerge as tm } from "tailwind-merge";
import { watch } from "tauri-plugin-fs-watch-api";
import TitlebarSpace from "@/components/TaskbarSpace";

function Filetree() {
  const { currentVaultPath, openPath } = useVault();
  const { addCmdkCommand } = useCmdk();

  const [filetree, setFiletree] = useState<FileEntry[]>([]);
  const filetreeRef = useRef<HTMLUListElement>(null);
  const [filetreeIsChanged, setFiletreeIsChanged] = useState(false);

  const [showFileInput, setShowFileInput] = useState(false);
  const [fileOrFolder, setFileOrFolder] = useState<"file" | "folder">("file");

  const initMakeNewFileOrFolder = async (fileOrFolder: "file" | "folder") => {
    setFileOrFolder(fileOrFolder);
    setShowFileInput(true);
  };

  useEffect(() => {
    addCmdkCommand("new-file", {
      label: "New File",
      action: () => initMakeNewFileOrFolder("file"),
    });
    addCmdkCommand("new-folder", {
      label: "New Folder",
      action: () => initMakeNewFileOrFolder("folder"),
    });
  }, []);

  const watchForFileChanges = async (path: string) => {
    await watch([path], async () => await getDirectoryContents(path), {
      recursive: true,
    });
  };

  const sortName = (a: FileEntry, b: FileEntry) => {
    if (a.name === b.name) return 0;
    if (!a.name) return -1;
    if (!b.name) return 1;
    return a.name.localeCompare(b.name);
  };

  const sortRecursively = (filetree: FileEntry[]) => {
    filetree.sort((a, b) => {
      if (a.children && b.children) {
        return sortName(a, b);
      }
      if (a.children && !b.children) return -1;
      if (!a.children && b.children) return 1;
      return sortName(a, b);
    });
    filetree.forEach((file) => {
      if (file.children) {
        sortRecursively(file.children);
      }
    });
  };

  const getDirectoryContents = async (path: string | null) => {
    if (!path) return;
    const files = await readDir(path, { recursive: true });
    sortRecursively(files);
    setFiletree(files);
  };

  useEffect(() => {
    getDirectoryContents(currentVaultPath);
    if (currentVaultPath) {
      watchForFileChanges(currentVaultPath);
    }
  }, [currentVaultPath]);

  useEffect(() => {
    if (filetreeIsChanged) {
      getDirectoryContents(currentVaultPath);
      setFiletreeIsChanged(false);
    }
  }, [filetreeIsChanged]);

  if (!currentVaultPath) return null;

  return (
    <div className="bg-base-300 h-screen">
      <TitlebarSpace />
      <div className="flex w-full justify-center gap-2">
        <div className="tooltip tooltip-bottom" data-tip="New File">
          <button onClick={() => initMakeNewFileOrFolder("file")}>
            <FilePlus size={20} />
          </button>
        </div>
        <div className="tooltip tooltip-bottom" data-tip="New Folder">
          <button onClick={() => initMakeNewFileOrFolder("folder")}>
            <FolderPlus size={20} />
          </button>
        </div>
      </div>
      <ul
        ref={filetreeRef}
        className={tm(
          "bg-base-300 flex select-none flex-col items-start justify-start p-1",
        )}
      >
        {filetree.map(
          (file) =>
            !file.name?.startsWith(".") &&
            file.name !== "conf.lame" && (
              <FiletreeItem
                key={file.path}
                {...file}
                updateFiletree={() => setFiletreeIsChanged(true)}
              />
            ),
        )}
        {showFileInput && (
          <FiletreeInput
            updateFiletree={() => setFiletreeIsChanged(true)}
            onCanceled={() => setShowFileInput(false)}
            onChanged={(newPath) =>
              makeNewFileOrFolder(
                newPath,
                currentVaultPath,
                fileOrFolder,
                () => getDirectoryContents(currentVaultPath),
                openPath,
              )
            }
          />
        )}
      </ul>
    </div>
  );
}

export default Filetree;

type FiletreeItemProps = FileEntry & {
  updateFiletree: () => void;
};

const FiletreeItem = ({
  name,
  path,
  children,
  updateFiletree,
}: FiletreeItemProps) => {
  const { openPath, openedPath } = useVault();
  const [isOpen, setIsOpen] = useState(false);
  const isDirectory = children !== undefined;
  const itemRef = useRef<HTMLLIElement>(null);

  const { openContextMenu, closeContextMenu } = useContextMenu();

  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [fileOrFolder, setFileOrFolder] = useState<"file" | "folder">("file");

  const initMakeNewFileOrFolder = async (fileOrFolder: "file" | "folder") => {
    closeContextMenu();
    setFileOrFolder(fileOrFolder);
    setShowNewFileInput(true);
  };

  const FiletreeDirectoryContextMenu = () => (
    <>
      <ContextMenuItem onClick={() => initMakeNewFileOrFolder("file")}>
        New File
      </ContextMenuItem>
      <ContextMenuItem onClick={() => initMakeNewFileOrFolder("folder")}>
        New Folder
      </ContextMenuItem>
    </>
  );

  const directoryContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    openContextMenu(event, itemRef.current, <FiletreeDirectoryContextMenu />);
  };

  const FiletreeItemContextMenu = () => (
    <>
      <ContextMenuItem onClick={() => console.log("Rename")}>
        Rename
      </ContextMenuItem>
      <ContextMenuItem onClick={() => console.log("Delete")}>
        Delete
      </ContextMenuItem>
    </>
  );

  const fileContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    openContextMenu(event, itemRef.current, <FiletreeItemContextMenu />);
  };

  return (
    <li className="ml-2" ref={itemRef}>
      <button
        onClick={() =>
          isDirectory ? setIsOpen((prev) => !prev) : openPath(path)
        }
        onContextMenu={isDirectory ? directoryContextMenu : fileContextMenu}
        className={tm(
          "flex w-full items-center overflow-hidden text-ellipsis whitespace-nowrap",
          openedPath === path && "text-blue-400",
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
          {showNewFileInput && (
            <FiletreeInput
              updateFiletree={updateFiletree}
              onCanceled={() => setShowNewFileInput(false)}
              onChanged={(newPath) =>
                makeNewFileOrFolder(
                  newPath,
                  path,
                  fileOrFolder,
                  updateFiletree,
                  openPath,
                )
              }
            />
          )}
          {children.map(
            (child) =>
              !child.name?.startsWith(".") && (
                <span key={child.path} className={isOpen ? "" : "hidden"}>
                  <FiletreeItem {...child} updateFiletree={updateFiletree} />
                </span>
              ),
          )}
        </ul>
      )}
    </li>
  );
};

const makeNewFileOrFolder = async (
  newName: string,
  path: string,
  fileOrFolder: "file" | "folder",
  updateFiletree: () => void,
  openPath: (path: string) => void,
) => {
  const newPath = `${path}/${newName}`;
  const fileAlreadyExists = await exists(newPath);
  if (!fileAlreadyExists) {
    switch (fileOrFolder) {
      case "file":
        await writeTextFile(newPath, "");
        break;
      case "folder":
        if (newPath.endsWith("/")) {
          await createDir(newPath);
          break;
        }
        await createDir(`${newPath}/`);
        break;
    }
    updateFiletree();
  }
  if (fileOrFolder === "file") {
    openPath(newPath);
  }
};

interface FiletreeInputProps {
  path?: string;
  updateFiletree: () => void;
  onCanceled: () => void;
  onChanged: (newPath: string) => void;
}

const FiletreeInput = (props: FiletreeInputProps) => {
  const { path, updateFiletree, onCanceled, onChanged } = props;

  const [value, setValue] = useState(path ?? "");

  const handleBlur = () => {
    if (value === "") return onCanceled();
    onChanged(value);
    updateFiletree();
    onCanceled();
  };

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") handleBlur();
  };

  return (
    <li className="ml-3">
      <input
        className="w-full"
        type="text"
        value={value}
        autoFocus
        onChange={(ev) => setValue(ev.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};
