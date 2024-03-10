import { exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useCmdk } from "./useCmdk";

const KeymapIdentifierSchema = z.union([
  z.literal("newFile"),
  z.literal("newFolder"),
  z.literal("openSettings"),
  z.literal("openCmdk"),
]);
/**
 * String literal union type for all available keymap identifiers
 *
 * @example
 * const keymap: KeymapIdentifier = "newFile";
 */
export type KeymapIdentifier = z.infer<typeof KeymapIdentifierSchema>;

/**
 * Vault-level configuration file format in zod
 */
const ConfigSchema = z.object({
  keymaps: z.record(KeymapIdentifierSchema, z.string()).optional(),
});
export type Config = z.infer<typeof ConfigSchema>;

type Literal = string | number | boolean;

interface ConfigContextType {
  config: Config;
  updateConfig: (identifier: string, value: Literal) => Promise<void>;
  updateCurrentVaultPath: (path: string | null) => void;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Config>(ConfigSchema.parse({}));
  const [currentVaultPath, setCurrentVaultPath] = useState<string | null>(null);
  const { updateCmdkCommandShortcut } = useCmdk();

  const updateConfig = async (
    /**
     * Identifier of the config value to update, could be deep
     *
     * @example
     * "keymaps.newFile"
     */
    identifier: string,
    /**
     * New value for the config
     *
     * @example
     * "ctrl+n"
     */
    value: Literal
  ) => {
    if (!currentVaultPath) return;
    console.log({ identifier, value, currentVaultPath });
    const newConfig = recursiveUpdate(
      { ...config },
      identifier.split("."),
      value
    );
    setConfig(newConfig);
    await writeConfig(currentVaultPath, newConfig);
  };

  type RecursiveObject = {
    [key: string]: string | number | boolean | RecursiveObject;
  };

  const recursiveUpdate = <T extends RecursiveObject>(
    object: T,
    path: string[],
    value: string | number | boolean
  ): T => {
    const [head, ...tail] = path;
    if (tail.length === 0) {
      return { ...object, [head]: value };
    }
    return {
      ...object,
      [head]: recursiveUpdate(object[head] as RecursiveObject, tail, value),
    };
  };

  const readConfig = async () => {
    if (!currentVaultPath) return setConfig(ConfigSchema.parse({}));
    const configFile = await readTextFile(`${currentVaultPath}/lame.json`);
    const parsed = ConfigSchema.safeParse(JSON.parse(configFile));
    if (parsed.success) {
      setConfig(parsed.data);
      parsed.data.keymaps &&
        Object.entries(parsed.data.keymaps).forEach(([key, value]) => {
          updateCmdkCommandShortcut(key as KeymapIdentifier, value);
        });
    } else {
      setConfig(ConfigSchema.parse({}));
    }
  };

  useEffect(() => {
    if (!currentVaultPath) return;
    readConfig();
  }, [currentVaultPath]);

  const value: ConfigContextType = useMemo(
    () => ({
      config,
      updateConfig,
      updateCurrentVaultPath: setCurrentVaultPath,
    }),
    [config, currentVaultPath]
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

const writeConfig = async (currentVault: string, config: Config) => {
  await writeTextFile(`${currentVault}/lame.json`, JSON.stringify(config));
};

/**
 * Check if the `lame.json` config file exists, if not creates it in the selected directory
 * @param {string} path
 * @returns {Promise<void>}
 *
 */
export const checkConfigFile = async (path: string): Promise<void> => {
  const configFileExists = await exists(`${path}/lame.json`);
  if (!configFileExists) {
    await writeTextFile(`${path}/lame.json`, JSON.stringify({}));
  }
};

/**
 * Hook to access the config context
 * @returns {ConfigContextType}
 * @throws {Error} if used outside of a ConfigProvider
 */
const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export { useConfig, ConfigProvider };
