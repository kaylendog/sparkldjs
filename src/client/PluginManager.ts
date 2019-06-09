import { Collection } from "discord.js";

import { Plugin, PluginConstructor } from "../structures/plugins/Plugin";
import { SparklClient } from "./Client";

export class PluginManager {
	public client: SparklClient;

	private plugins: Collection<string, Plugin>;
	private hasStarted: boolean;
	constructor(client: SparklClient) {
		this.client = client;
		this.plugins = new Collection();

		this.hasStarted = false;

		this.client.on("ready", async () => {
			if (this.pluginCount < 1) {
				return this.client.logger.debug(`No plugin(s) to initialise`);
			}
			this.client.logger.debug(
				`Warming up plugins - ${
					this.pluginCount
				} plugin(s) to initialise...`,
			);

			// Wait for plugins to initialise
			const pluginWillStartIterator = this.plugins.map(
				async (v) =>
					await (v.onPluginWillStart ? v.onPluginWillStart() : null),
			);
			await Promise.all(pluginWillStartIterator);

			// Synchronously init plugins
			this.plugins.forEach((v) => (v.init ? v.init() : null));
			this.client.logger.info("Done.");
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
			m = new module(this.client);
		}
		this.plugins.set(m.pluginName, m);
		if (this.hasStarted) {
			await m.onPluginWillStart();
			m.init();
		}
	}

	/**
	 * Creates a new module
	 * @param {object} data - Plugin data
	 * @param {string} data.name - Name of the module
	 */
	public createPlugin(name: string, init: () => Promise<any>) {
		const moduleToAdd = new Plugin(this.client);
		moduleToAdd.pluginName = name;
		moduleToAdd.init = init;
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
