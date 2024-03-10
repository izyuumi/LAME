import { useQuery, useQueryClient } from "@tanstack/react-query";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { z } from "zod";

const KeymapIdentifierSchema = z.union([
  z.literal("newFile"),
  z.literal("newFolder"),
  z.literal("openSettings"),
  z.literal("openCmdk"),
]);
type KeymapIdentifier = z.infer<typeof KeymapIdentifierSchema>;

const ConfigSchema = z.object({
  currentVault: z.string().optional(),
  vaults: z.array(z.string()).optional(),
  keymap: z
    .object({
      id: KeymapIdentifierSchema,
      key: z.string(),
    })
    .array()
    .optional(),
});
type Config = z.infer<typeof ConfigSchema>;

const writeConfig = async (currentVault: string, config: Config) => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: ["config"],
  });
  await writeTextFile(`${currentVault}lame.json`, JSON.stringify(config));
};

const readConfig = async (currentVault: string) => {
  const configFile = await readTextFile(`${currentVault}lame.json`);
  const config = ConfigSchema.safeParse(JSON.parse(configFile));
  if (config.success) {
    return config.data;
  }
  return undefined;
};

/**
 * Hook to read the `lame.json` config file from the current vault
 *
 * @param currentVault the path to current vault
 * @returns config object from the `lame.json` file from the current vault
 */
const useConfig = (currentVault: string) => {
  return useQuery({
    queryKey: ["config"],
    queryFn: async () => await readConfig(currentVault),
  });
};

/**
 * Check if the `lame.json` config file exists, if not creates it in the selected directory
 * @param {string} path
 * @returns {Promise<void>}
 *
 */
const checkConfigFile = async (path: string): Promise<void> => {
  const configFileExists = await exists(`${path}/lame.json`);
  if (!configFileExists) {
    await writeTextFile(`${path}/lame.json`, JSON.stringify({}));
  }
};

export type { Config, KeymapIdentifier, ConfigSchema };
export { writeConfig, useConfig, checkConfigFile };
