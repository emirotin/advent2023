import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getDirname = (metaUrl: string) =>
	path.dirname(fileURLToPath(metaUrl));

export const getFilePath = (metaUrl: string, fileName: string) => {
	return path.join(getDirname(metaUrl), fileName);
};

export const readLines = (metaUrl: string, fileName: string) => {
	return fs.readFileSync(getFilePath(metaUrl, fileName), "utf-8").split("\n");
};

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const uniq = <T>(arr: T[]) => [...new Set(arr)];
