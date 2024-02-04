import "./tiptap.scss";

import { useVault } from "@/hooks";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { useEffect } from "react";

function Editor() {
	const { openedPath } = useVault();
	const editor = useEditor({
		extensions: [StarterKit],
		content: "",
	});

	const readFile = async () => {
		if (!openedPath) return;
		const fileContents = await readTextFile(
			"Downloads/test vault/test/test.txt",
			{
				dir: BaseDirectory.Home,
			},
		);
		editor?.commands.setContent(fileContents);
	};

	useEffect(() => {
		readFile();
	}, []);

	return <EditorContent editor={editor} className="h-full w-full p-4" />;
}

export default Editor;
