import { readLines, sum } from "../lib/index.js";

type Module =
	// | UnknownModule
	BroadcasterModule | FlipFlopModule | OutputModule | ConjunctionModule;

const modules = new Map<string, Module>();

const signalCounts = {
	low: 0,
	high: 0,
};

const signalsQueue: Array<{
	sender: string;
	receiver: string;
	signal: boolean;
}> = [];

const handleSignal = () => {
	if (!signalsQueue.length) return;
	const { sender, receiver, signal } = signalsQueue.shift()!;
	modules.get(receiver)?.receiveSignal(sender, signal);
};

const sendSignal = (sender: string, receiver: string, signal: boolean) => {
	signalCounts[signal ? "high" : "low"] += 1;
	signalsQueue.push({ sender, receiver, signal });
};

abstract class GenericModule {
	private inputs: string[] = [];

	constructor(private name: string, private destinations: string[]) {}

	addInput(sender: string) {
		this.inputs.push(sender);
	}

	notifyConnections() {
		for (const d of this.destinations) {
			modules.get(d)?.addInput(this.name);
		}
	}

	abstract receiveSignal(sender: string, signal: boolean): void;

	sendSignal(signal: boolean) {
		for (const d of this.destinations) {
			sendSignal(this.name, d, signal);
		}
	}
}

class OutputModule extends GenericModule {
	private signal: boolean = false;

	constructor(name: string) {
		super(name, []);
	}

	receiveSignal(_sender: string, signal: boolean) {
		this.signal = signal;
	}
}

class FlipFlopModule extends GenericModule {
	state = false;

	receiveSignal(sender: string, signal: boolean) {
		if (signal) return;
		this.state = !this.state;
		this.sendSignal(this.state);
	}
}

class ConjunctionModule extends GenericModule {
	states: Record<string, boolean> = {};

	addInput(sender: string): void {
		super.addInput(sender);
		this.states[sender] = false;
	}

	receiveSignal(sender: string, signal: boolean): void {
		this.states[sender] = signal;
		this.sendSignal(!Object.values(this.states).every(Boolean));
	}
}

class BroadcasterModule extends GenericModule {
	receiveSignal(_sender: string, signal: boolean): void {
		this.sendSignal(signal);
	}
}

const pushTheButtonTM = () => {
	sendSignal("_button_", "broadcaster", false);
	while (signalsQueue.length) {
		handleSignal();
	}
};

const parseModule = (s: string) => {
	let [name, destStr] = s.split(" -> ");
	const destinations = destStr!.split(", ");
	for (const d of destinations) {
		if (!modules.has(d)) {
			modules.set(d, new OutputModule(d));
		}
	}

	let module: Module;
	if (name!.startsWith("%")) {
		name = name!.slice(1);
		module = new FlipFlopModule(name, destinations);
	} else if (name!.startsWith("&")) {
		name = name!.slice(1);
		module = new ConjunctionModule(name, destinations);
	} else if (name === "broadcaster") {
		module = new BroadcasterModule(name, destinations);
	} else {
		name = name!;
		module = new OutputModule(name);
	}

	modules.set(name, module);
};

readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.forEach(parseModule);

for (const m of modules.values()) {
	m.notifyConnections();
}

for (let i = 0; i < 1000; i++) {
	pushTheButtonTM();
}

console.log(signalCounts.high * signalCounts.low);
