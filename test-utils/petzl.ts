import { Petzl } from "../dist/petzl";

class Store {
	logs: string[][] = [];

	pushToLogs = (...args: any[]) => {
		this.logs.push(args);
	};

	getLogs = () => {
		return this.logs;
	};
}
const store = new Store();

const petzl = new Petzl({
	dev: {
		logger: {
			log: store.pushToLogs,
		},
	},
	colors: false,
	collector: {
		use: "sequencer",
		sequence: ["test-utils/test-tests/it.ts"],
	},
});

export { petzl, store };
