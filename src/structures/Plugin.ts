import { Client } from "discord.js";

import { SparklClient } from "../client/Client";
import { Logger } from "../util/Logger";

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
	public logger: Logger;
	public discord: Client;

	constructor(client: SparklClient) {
		this.client = client;
		this.logger = this.client.logger;
		this.discord = this.client.discord;
		this.sendMessage = this.client.sendMessage;
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
