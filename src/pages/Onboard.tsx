import { useEffect } from "react";
import { useSidebar, useVault } from "@/hooks";
import { open } from "@tauri-apps/api/dialog";
import { appWindow } from "@tauri-apps/api/window";
import { readDir, exists, writeTextFile } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";

export function Onboard() {
	const { closeSidebar, openSidebar } = useSidebar();
	const { setCurrentVaultPath } = useVault();
	const navigate = useNavigate();

	useEffect(() => {
		closeSidebar();
	}, []);

	appWindow.listen("tauri://file-drop", async (event) => {
		console.log(event.payload);
	});

	/**
	 * Opens a file dialog to select a directory
	 * @returns {Promise<void>}
	 */
	const selectVault = async (): Promise<void> => {
		const selected = await open({
			title: "Select a vault",
			multiple: false,
			directory: true,
		});
		if (selected === null) return;
		if (Array.isArray(selected) && selected.length === 0) return;
		if (typeof selected === "string") {
			await initVault(selected);
		} else {
			if (selected.length < 1) return;
			await initVault(selected[0]);
		}
	};

	const initVault = async (path: string) => {
		await checkConfigFile(path);
		setCurrentVaultPath(path);
		navigate(`/dashboard`);
		openSidebar();
	};

	/**
	 * Check if the `conf.lame` config file exists, if not creates it in the selected directory
	 * @param {string} path
	 * @returns {Promise<void>}
	 *
	 */
	const checkConfigFile = async (path: string) => {
		const configFileExists = await exists(`${path}/conf.lame`);
		if (!configFileExists) {
			await writeTextFile(`${path}/conf.lame`, JSON.stringify({}));
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
			<h1>Welcome to the LAME</h1>
			<p>
				<strong>L</strong>OL <strong>A</strong>nother <strong>M</strong>
				arkdown <strong>E</strong>ditor
			</p>
			<p>Drag and drop a directory to get started</p>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={selectVault}
			>
				Select directory
			</button>
		</div>
	);
}
