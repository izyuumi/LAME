import { useVault } from "@/hooks";
import { type FileEntry, readDir } from "@tauri-apps/api/fs";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge as tm } from "tailwind-merge";

function Filetree() {
	const { currentVaultPath } = useVault();

	const [filetree, setFiletree] = useState<FileEntry[]>([]);
	const filetreeRef = useRef<HTMLUListElement>(null);

	const getDirectoryContents = async (path: string | null) => {
		if (!path) return;
		const files = await readDir(path, { recursive: true });
		setFiletree(files);
	};

	useEffect(() => {
		getDirectoryContents(currentVaultPath);
	}, [currentVaultPath]);

	return (
		<ul
			ref={filetreeRef}
			className="flex flex-col w-[150px] p-1 bg-base-300 select-none"
		>
			{filetree.map(
				(file) =>
					!file.name?.startsWith(".") &&
					file.name !== "conf.lame" && (
						<FiletreeItem key={file.path} {...file} />
					),
			)}
		</ul>
	);
}

export default Filetree;

const FiletreeItem = ({ name, path, children }: FileEntry) => {
	const { openPath, openedPath } = useVault();
	const [isOpen, setIsOpen] = useState(false);
	const isDirectory = children !== undefined;

	return (
		<li className="ml-2">
			<button
				onClick={() =>
					isDirectory ? setIsOpen((prev) => !prev) : openPath(path)
				}
				className={tm(
					"flex items-center w-full",
					openedPath === path && "text-[#0052ff]",
					!isDirectory && "ml-3",
				)}
			>
				{isDirectory &&
					(isOpen ? (
						<ChevronDown size={16} className="mr-1 opacity-40" />
					) : (
						<ChevronRight size={16} className="mr-1 opacity-40" />
					))}
				{name}
			</button>
			{isDirectory && (
				<ul>
					{children.map(
						(child) =>
							!child.name?.startsWith(".") && (
								<span key={child.path} className={isOpen ? "" : "hidden"}>
									<FiletreeItem {...child} />
								</span>
							),
					)}
				</ul>
			)}
		</li>
	);
};
