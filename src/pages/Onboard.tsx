import { open } from "@tauri-apps/api/dialog";
import { appWindow } from "@tauri-apps/api/window";

export function Onboard() {
	appWindow.listen("tauri://file-drop", (event) => {
		console.log(event);
	});

	const selectVault = async () => {
		const selected = await open({
			title: "Select a vault",
			multiple: false,
			directory: true,
		});
		console.log(selected);
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
