import fs from "fs";

export const readLines = (fileName: string) => {
	return fs.readFileSync(fileName, "utf-8").split("\n");
};
