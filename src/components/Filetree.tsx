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
		for (const file of files) {
			console.log(file);
		}
		setFiletree(files);
	};

	useEffect(() => {
		getDirectoryContents(currentVaultPath);
	}, [currentVaultPath]);

	return (
		<ul ref={filetreeRef} className="flex flex-col w-[150px] p-1 bg-base-300">
			{filetree.map(
				(file) =>
					!file.name?.startsWith(".") && (
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
	const isDirectory = children && children.length > 0;

	return (
		<li className="ml-1">
			<button
				onClick={() =>
					isDirectory ? setIsOpen((prev) => !prev) : openPath(path)
				}
				className={tm(
					"flex items-center w-full",
					openedPath === path && "text-[#0052ff]",
				)}
			>
				{isDirectory &&
					(isOpen ? (
						<ChevronDown size={16} className="mr-1" />
					) : (
						<ChevronRight size={16} className="mr-1" />
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
