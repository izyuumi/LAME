import "@/components/editor/tiptap.scss";

import TitlebarSpace from "@/components/TaskbarSpace";
import { useVault } from "@/hooks";
import { readTextFile } from "@tauri-apps/api/fs";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { invoke as TAURI_INVOKE } from "@tauri-apps/api";
import { twMerge as tm } from "tailwind-merge";
import MenuBar from "@/components/editor/MenuBar";

export function Dashboard() {
  const navigate = useNavigate();
  const { currentVaultPath, openedPath } = useVault();

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    onUpdate: async ({ editor }) => {
      console.log(
        await TAURI_INVOKE("parse_html_as_markdown", {
          htmlString: editor.getHTML(),
        }),
      );
      console.log(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!currentVaultPath) navigate("/onboarding");
  }, [currentVaultPath]);

  const readFile = async () => {
    if (!openedPath || !editor) return;
    const fileContents = await readTextFile(openedPath);
    const parsedFile = await TAURI_INVOKE<string>("parse_markdown_as_html", {
      fileString: fileContents,
    });
    editor.commands.setContent(parsedFile);
  };

  useEffect(() => {
    readFile();
  }, [openedPath]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <TitlebarSpace className="flex h-auto items-center justify-between border-b border-solid border-b-black p-2">
        <div />
        <h1 className="max-w-full overflow-hidden text-ellipsis">
          {openedPath &&
            currentVaultPath &&
            openedPath.replace(currentVaultPath, "")}
        </h1>
        <div>{editor && <MenuBar editor={editor} />}</div>
      </TitlebarSpace>
      {openedPath ? (
        <EditorContent
          editor={editor}
          className={tm("h-full w-full p-4", !openedPath && "hidden")}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-center text-3xl">
          <h2>Open a file to start editing</h2>
        </div>
      )}
    </div>
  );
}
