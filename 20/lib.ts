export const prepareModules = (moduleSpecs: string[]) => {
	type Module =
		| BroadcasterModule
		| FlipFlopModule
		| OutputModule
		| ConjunctionModule;

	const modules = new Map<string, Module>();

	const signalCounts = {
		low: 0,
		high: 0,
	};

	let seenRxLow = false;

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
		if (receiver === "rx" && !signal) {
			seenRxLow = true;
		}
	};

	abstract class GenericModule {
		inputs: string[] = [];
		type = "generic";

		constructor(public name: string, public destinations: string[]) {}

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

		toJSON() {
			return {
				name: this.name,
				destinations: this.destinations,
				type: this.type,
			};
		}
	}

	class OutputModule extends GenericModule {
		type = "output";
		private state: boolean = false;

		constructor(name: string) {
			super(name, []);
		}

		receiveSignal(_sender: string, signal: boolean) {
			this.state = signal;
		}
	}

	class FlipFlopModule extends GenericModule {
		type = "flip";
		state = false;

		receiveSignal(sender: string, signal: boolean) {
			if (signal) return;
			this.state = !this.state;
			this.sendSignal(this.state);
		}
	}

	class ConjunctionModule extends GenericModule {
		type = "conj";
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
		type = "bcast";

		receiveSignal(_sender: string, signal: boolean): void {
			this.sendSignal(signal);
		}

		toJSON() {
			return { ...super.toJSON() };
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

	moduleSpecs.forEach(parseModule);

	for (const m of modules.values()) {
		m.notifyConnections();
	}

	return {
		pushTheButtonTM,
		signalCounts,
		modules,
		OutputModule,
		FlipFlopModule,
		ConjunctionModule,
		BroadcasterModule,
	};
};
