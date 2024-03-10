import { exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

type ConfigKey = "currentVault" | "vaults";

type ConfigRecord = {
	[key in ConfigKey]?: string;
};

const writeConfig = async (currentVault: string, config: ConfigRecord) => {
	let configFile = "";
	for (const key in config) {
		configFile += `${key} ${config[key as ConfigKey]}\n`;
	}
	await writeTextFile(currentVault + "conf.lame", configFile);
};

const readConfig = async (currentVault: string) => {
	const configFile = await readTextFile(currentVault + "conf.lame");
	let config: ConfigRecord = {};

	for (let line of configFile.split("\n")) {
		if (!line || line[0] === "#") continue;
		const [key, value] = line.trim().split(/s+/);
		if (!key || !value) continue;
	}

	return config;
};

/**
 * Check if the `conf.lame` config file exists, if not creates it in the selected directory
 * @param {string} path
 * @returns {Promise<void>}
 *
 */
const checkConfigFile = async (path: string): Promise<void> => {
	const configFileExists = await exists(`${path}/conf.lame`);
	if (!configFileExists) {
		await writeTextFile(`${path}/conf.lame`, JSON.stringify({}));
	}
};

export type { ConfigKey, ConfigRecord };
export { writeConfig, readConfig, checkConfigFile };
