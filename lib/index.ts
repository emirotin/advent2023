import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getDirname = (metaUrl: string) =>
	path.dirname(fileURLToPath(metaUrl));

export const getFilePath = (metaUrl: string, fileName: string) => {
	return path.join(getDirname(metaUrl), fileName);
};

export const readFile = (metaUrl: string, fileName: string) => {
	return fs.readFileSync(getFilePath(metaUrl, fileName), "utf-8");
};

export const readLines = (metaUrl: string, fileName: string) => {
	return readFile(metaUrl, fileName).split("\n");
};

export const sum = (arr: number[] | readonly number[]) =>
	arr.reduce((a, b) => a + b, 0);

export const prod = (arr: number[]) => arr.reduce((a, b) => a * b, 1);

export const uniq = <T>(arr: T[]) => [...new Set(arr)];

export const parseNums = (line: string, sep: string | RegExp = /\s+/) =>
	line.split(sep).map((n) => parseInt(n));
