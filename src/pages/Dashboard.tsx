import { useVault } from "@/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
	const navigate = useNavigate();
	const { currentVaultPath } = useVault();

	useEffect(() => {
		if (!currentVaultPath) {
			console.error("No vault path set, redirecting to onboarding");
			navigate("/onboarding");
		}
	}, [currentVaultPath]);

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Current vault: {currentVaultPath}</p>
		</div>
	);
}
