import { Collection } from "discord.js";

import { Plugin, PluginConstructor } from "../structures/Plugin";
import { TailClient } from "./Client";

export class PluginManager {
	public client: TailClient;

	private plugins: Collection<string, Plugin>;
	private hasStarted: boolean;
	constructor(client: TailClient) {
		this.client = client;
		this.plugins = new Collection();

		this.hasStarted = false;

		this.client.on("ready", async () => {
			this.client.logger.debug(
				`Warming up plugins - ${this.pluginCount} module(s) to start...`,
			);

			// Wait for plugins to start
			const pluginWillStartIterator = this.plugins.map(
				async (v) =>
					await (v.onPluginWillStart ? v.onPluginWillStart() : null),
			);
			await Promise.all(pluginWillStartIterator);

			// Synchronously start plugins
			this.plugins.forEach((v) => (v.start ? v.start() : null));
			this.client.logger.log("Done.");
			this.hasStarted = true;
		});
	}

	/**
	 * Adds a module to the client
	 * @param {Plugin | PluginConstructor} module
	 */
	public async addPlugin(module: PluginConstructor | Plugin) {
		let m: Plugin;
		if (module instanceof Plugin) {
			m = module;
		} else {
			console.log("Constructing...");
			m = new module(this.client);
		}
		this.plugins.set(m.pluginName, m);
		if (this.hasStarted) {
			await m.onPluginWillStart();
			m.start();
		}
	}

	/**
	 * Creates a new module
	 * @param {object} data - Plugin data
	 * @param {string} data.name - Name of the module
	 */
	public createPlugin(name: string, start: () => any) {
		const moduleToAdd = new Plugin(this.client);
		moduleToAdd.pluginName = name;
		moduleToAdd.start = start;
		this.addPlugin(moduleToAdd);
	}
	/**
	 * Number of plugins stored
	 */
	get pluginCount() {
		return this.plugins.size;
	}

	public sendMessage(dest: string, type: string, ...data: any[]) {
		const plugin = this.plugins.get("dest");
		if (plugin) {
			plugin.onReceiveMessage(type, data);
		}
	}
}
