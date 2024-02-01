import { useSidebar } from "@/hooks";

export function Sidebar() {
	const { sidebarIsOpen } = useSidebar();

	return (
		<>
			{sidebarIsOpen && (
				<div className="h-screen">
					<ul className="menu p-4 min-h-full bg-base-200 text-base-content"></ul>
				</div>
			)}
		</>
	);
}
