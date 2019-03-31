import { Client } from "discord.js";
import { TailClient } from "../client/Client";
import { PluginManager } from "../client/PluginManager";
import { Logger } from "../util/Logger";

export declare interface Plugin {
	pluginName: string;
	client: TailClient;
	start(): any;

	sendMessage(dest: string, type: string, ...data: any[]): any;
	onPluginWillStart(): any;
	onReceiveMessage(type: string, ...data: any[]): any;
}

export type PluginConstructor = new (c: TailClient) => Plugin;

export class Plugin {
	public static pluginName: string;
	public client: TailClient;
	public logger: Logger;
	public discord: Client;

	constructor(client: TailClient) {
		this.client = client;
		this.logger = this.client.logger;
		this.discord = this.client.discord;
		this.sendMessage = this.client.sendMessage;
	}
}

export function plugin(name: string, onStart: () => any) {
	return (client: TailClient) => {
		const m = new Plugin(client);
		m.pluginName = name;
		m.start = onStart;
		return m;
	};
}
