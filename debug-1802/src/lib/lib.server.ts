import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (metaUrl: string) => path.dirname(fileURLToPath(metaUrl));

export const getFilePath = (metaUrl: string, fileName: string) => {
	return path.join(getDirname(metaUrl), fileName);
};

export const readFile = (metaUrl: string, fileName: string) => {
	return fs.readFileSync(getFilePath(metaUrl, fileName), 'utf-8');
};

export const readLines = (metaUrl: string, fileName: string) => {
	return readFile(metaUrl, fileName).split('\n');
};
