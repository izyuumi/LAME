import "./tiptap.scss";

import { useVault } from "@/hooks";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { readTextFile } from "@tauri-apps/api/fs";
import { useEffect } from "react";
import { invoke as TAURI_INVOKE } from "@tauri-apps/api";
import { twMerge as tm } from "tailwind-merge";

function Editor() {
  const { openedPath } = useVault();
  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
  });

  const readFile = async () => {
    if (!openedPath) return;
    const fileContents = await readTextFile(openedPath);
    const parsedFile = (await TAURI_INVOKE("parse_text_to_markdown", {
      fileString: fileContents,
    })) as string;
    editor!.commands.setContent(parsedFile);
    console.log(parsedFile);
  };

  useEffect(() => {
    readFile();
  }, [openedPath]);

  return (
    <EditorContent
      editor={editor}
      className={tm("h-full w-full p-4", !openedPath && "hidden")}
    />
  );
}

export default Editor;
