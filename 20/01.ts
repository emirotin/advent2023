import { readLines } from "../lib/index.js";
import { prepareModules } from "./lib.js";

const { pushTheButtonTM, signalCounts } = prepareModules(
	readLines(import.meta.url, "input.txt")
		.map((l) => l.trim())
		.filter(Boolean)
);

for (let i = 0; i < 1000; i++) {
	pushTheButtonTM();
}

console.log(signalCounts.high * signalCounts.low);
