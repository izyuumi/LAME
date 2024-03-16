import { exists } from "@tauri-apps/api/fs";
import { invoke as TAURI_INVOKE } from "@tauri-apps/api";

type RenameFileReturn = "destIsNotEmpty" | "somethingWentWrong" | "success";
const renameFile = async (
	src: string,
	dest: string,
): Promise<RenameFileReturn> => {
	const desinationExists = await exists(dest);
	if (desinationExists) return "destIsNotEmpty";

	return await TAURI_INVOKE<string>("rename_file", {
		src,
		dest,
	})
		.then(() => "success" as RenameFileReturn)
		.catch((e) => {
			console.error(e);
			return "somethingWentWrong";
		});
};

export { renameFile };
