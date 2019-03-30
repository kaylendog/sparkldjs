import { TailClient } from "../client/Client";

export declare interface Module {
	moduleName: string;
	client: TailClient;

	start(): any;
	onModuleWillStart(): any;
}

export type ModuleConstructor = new (c: TailClient) => Module;

export class Module {
	public static moduleName: string;
	public client: TailClient;

	constructor(client: TailClient) {
		this.client = client;
	}
}

export function module(name: string, onStart: () => any) {
	return (client: TailClient) => {
		const m = new Module(client);
		m.moduleName = name;
		m.start = onStart;
		return m;
	};
}
