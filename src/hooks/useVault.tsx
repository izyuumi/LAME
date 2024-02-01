import React, { createContext, useContext, useMemo, useState } from "react";

interface VaultConfig { }

interface VaultContext {
	currentVaultPath: string | null;
	setCurrentVaultPath: (path: string) => void;
	vaultConfig: VaultConfig;
	setVaultConfig: (config: VaultConfig) => void;
}

const VaultContext = createContext<VaultContext | null>(null);

const VaultProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentVaultPath, setCurrentVaultPath] = useState<string | null>(null);
	const [vaultConfig, setVaultConfig] = useState<VaultConfig>({});

	const value = useMemo(
		() => ({
			currentVaultPath,
			setCurrentVaultPath,
			vaultConfig,
			setVaultConfig,
		}),
		[currentVaultPath, vaultConfig],
	);

	return (
		<VaultContext.Provider value={value}>{children}</VaultContext.Provider>
	);
};

/**
 * Hook to access the vault context
 * @returns {VaultContext}
 * @throws {Error} if used outside of a VaultProvider
 */
const useVault = (): VaultContext => {
	const context = useContext(VaultContext);
	if (!context) {
		throw new Error("useVault must be used within a VaultProvider");
	}
	return context;
};

export { useVault, VaultProvider };
