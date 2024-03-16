import "@/components/editor/tiptap.scss";

import TitlebarSpace from "@/components/TaskbarSpace";
import { useCmdk, useVault } from "@/hooks";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke as TAURI_INVOKE } from "@tauri-apps/api";
import { twMerge as tm } from "tailwind-merge";
import MenuBar from "@/components/editor/MenuBar";
import { renameFile } from "@/utils";
import { message } from "@tauri-apps/api/dialog";

export function Dashboard() {
	const navigate = useNavigate();
	const { currentVaultPath, openedPath, openPath } = useVault();
	const [currentPath, setCurrentPath] = useState<string>("");

	const { setInterfaceContext } = useCmdk();
	const [lastOpenedPath, setLastOpenedPath] = useState<string | null>(null);

	const [lastSavedDate, setLastSavedDate] = useState<Date | null>(null);

	const saveToDisk = async (htmlString: string, path: string | null) => {
		if (!path) return;
		const md = await TAURI_INVOKE<string>("parse_html_as_markdown", {
			htmlString,
		});
		await writeTextFile(path, md);
		setLastSavedDate(new Date());
	};

	const editor = useEditor({
		extensions: [StarterKit, Underline],
		onUpdate: async ({ editor }) => {
			// If in development, console.log the HTML
			if (import.meta.env.MODE === "development") {
				console.log(editor.getHTML());
			}
			// Save to disk only if the last save was more than 5 seconds ago
			if (
				!lastSavedDate ||
				lastSavedDate.getTime() + 5000 < new Date().getTime()
			) {
				await saveToDisk(editor.getHTML(), openedPath);
			}
		},
		onFocus: () => setInterfaceContext("editor"),
	});

	// Save to disk on unmount
	useEffect(() => {
		return () => {
			if (editor) saveToDisk(editor.getHTML(), openedPath);
		};
	}, []);

	// Redirect to onboarding if no vault is open
	useEffect(() => {
		if (!currentVaultPath) navigate("/onboarding");
	}, [currentVaultPath]);

	// Read file from disk
	const readFile = async () => {
		if (!openedPath || !editor) return;
		await saveToDisk(editor.getHTML(), lastOpenedPath);
		setLastSavedDate(null);
		const fileContents = await readTextFile(openedPath);
		const parsedFile = await TAURI_INVOKE<string>("parse_markdown_as_html", {
			fileString: fileContents,
		});
		editor.commands.setContent(parsedFile);
		setLastOpenedPath(openedPath);
	};

	useEffect(() => {
		readFile();
		editor?.commands.focus();
		currentVaultPath &&
			setCurrentPath(openedPath?.replace(currentVaultPath, "") ?? "");
	}, [openedPath]);

	// Rename file on enter
	const onFileRename = async (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") return;
		if (!openedPath || !currentVaultPath || !currentPath || !editor) return;
		if (currentPath === openedPath.replace(currentVaultPath, "")) return;
		await saveToDisk(editor.getHTML(), openedPath);
		const newPath = `${currentVaultPath}/${currentPath}`.replace("//", "/");
		const res = await renameFile(openedPath, newPath);
		switch (res) {
			case "success":
				openPath(newPath);
				break;
			case "destIsNotEmpty":
				await message("Destination is not empty");
				setCurrentPath(openedPath.replace(currentVaultPath, ""));
				break;
			case "somethingWentWrong":
				await message("Something went wrong");
				setCurrentPath(openedPath.replace(currentVaultPath, ""));
				break;
		}
	};

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<TitlebarSpace className="flex h-auto items-center justify-between border-b border-solid border-b-black p-2">
				<div />
				{openedPath && (
					<h1 className="max-w-full overflow-hidden text-ellipsis">
						<input
							className="text-center"
							value={currentPath}
							onChange={(e) => setCurrentPath(e.target.value)}
							onKeyDown={(e) => onFileRename(e)}
						/>
					</h1>
				)}
				<div>{editor && <MenuBar editor={editor} />}</div>
			</TitlebarSpace>
			<div className="mb-4 h-full w-full overflow-auto">
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
		</div>
	);
}
