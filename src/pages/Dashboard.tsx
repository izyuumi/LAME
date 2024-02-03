import { useVault } from "@/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
	const navigate = useNavigate();
	const { currentVaultPath, openedPath } = useVault();

	useEffect(() => {
		if (!currentVaultPath) {
			console.error("No vault path set, redirecting to onboarding");
			navigate("/onboarding");
		}
	}, [currentVaultPath]);

	return (
		<div className="flex h-screen w-screen justify-center items-center">
			{openedPath ? (
				<div>Opened path: {openedPath}</div>
			) : (
				<div>No path opened</div>
			)}
		</div>
	);
}
