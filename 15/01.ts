import { readFile, sum } from "../lib/index.js";
import { hash } from "./lib.js";

const strings = readFile(import.meta.url, "input.txt")
	.trim()
	.split(",");

console.log(sum(strings.map(hash)));
