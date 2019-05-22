import * as winston from "winston";

import { SparklClient } from "../client/Client";

export declare interface Plugin {
	pluginName: string;
	client: SparklClient;
	start(): any;

	sendMessage(dest: string, type: string, ...data: any[]): any;
	onPluginWillStart(): any;
	onReceiveMessage(type: string, ...data: any[]): any;
}

export type PluginConstructor = new (c: SparklClient) => Plugin;

export class Plugin {
	public static pluginName: string;
	public client: SparklClient;
	public logger: winston.Logger;

	constructor(client: SparklClient) {
		this.client = client;
		this.logger = this.client.logger;
	}
}

export function plugin(name: string, onStart: () => any) {
	return (client: SparklClient) => {
		const m = new Plugin(client);
		m.pluginName = name;
		m.start = onStart;
		return m;
	};
}
