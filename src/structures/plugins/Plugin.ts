import { Message } from "discord.js";
import * as winston from "winston";

import { SparklClient } from "../../client/Client";

export declare interface Plugin {
	pluginName: string;
	client: SparklClient;
	init(): Promise<any>;
	reload(): Promise<any>;
	destroy(): Promise<any>;

	sendMessage(dest: string, type: string, ...data: any[]): any;
	onPluginWillStart(): any;
	onReceiveMessage(type: string, ...data: any[]): any;
}

export type PluginConstructor = new (c: SparklClient) => Plugin;

/**
 * Object for dynamically interacting with the Client
 */
export class Plugin {
	public static pluginName: string;
	public client: SparklClient;
	public logger: winston.Logger;

	constructor(client: SparklClient) {
		this.client = client;
		this.logger = this.client.logger;

		if (this.constructor.name === "Plugin") {
			throw new Error("The base Plugin cannot be instantiated.");
		}
	}
	/**
	 * Initialises the plugin
	 * @return {*}
	 * @abstract
	 */
	public init(): Promise<any> {
		throw new Error(
			`${this.constructor.name} doesn't have an init method.`,
		);
	}

	/**
	 * Called when the plugin is being reloaded
	 * @return {*}
	 * @abstract
	 */
	public reload(): Promise<any> {
		throw new Error(
			`${this.constructor.name} doesn't have a reload method.`,
		);
	}

	/**
	 * Initialises the plugin
	 * @return {*}
	 * @abstract
	 */
	public destroy(): Promise<any> {
		throw new Error(
			`${this.constructor.name} doesn't have a destroy method.`,
		);
	}

	/**
	 * Adds a removable event listener to the client - used for reloading.
	 * @param {String} event - The event name
	 * @param {*} listener - The listener to use
	 * @return {Plugin} The plugin object
	 * @abstract
	 */
	public on(event: string, listener: any): this {
		this.client.on(event, listener, this.constructor.name);
		throw new Error(`${this.constructor.name} doesn't have an on method.`);
	}

	public onPluginWillStart() {
		throw new Error(
			`${this.constructor.name} doesn't have an onPluginWillStart method.`,
		);
	}

	public onReceiveMessage() {
		throw new Error(
			`${this.constructor.name} doesn't have an onReceiveMessage method.`,
		);
	}

	public command(
		name: string,
		permissionLevel: number,
		syntax: string,
		exec: (c: SparklClient, m: Message, a: any[]) => any,
	) {
		this.client.command(name, permissionLevel, syntax, exec);
		return this;
	}
}

export function plugin(name: string, init: () => any) {
	return (client: SparklClient) => {
		const m = new Plugin(client);
		m.pluginName = name;
		m.init = init;
		return m;
	};
}
