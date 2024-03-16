export * from "./fs";

export const pathToId = (path: string) =>
	`filetree-item-${path.replace(/\/|\s/g, "_")}`;
