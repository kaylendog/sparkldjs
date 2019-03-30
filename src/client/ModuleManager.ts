import { Collection } from "discord.js";

import { Module, ModuleConstructor } from "../structures/Module";
import { TailClient } from "./Client";

export class ModuleManager {
	public client: TailClient;

	private modules: Collection<string, Module>;
	constructor(client: TailClient) {
		this.client = client;
		this.modules = new Collection();

		this.client.on("ready", async () => {
			this.client.logger.debug(
				`Warming up modules - ${this.moduleCount} module(s) to start...`,
			);

			// Wait for modules to start
			const moduleWillStartIterator = this.modules.map(
				async (v) =>
					await (v.onModuleWillStart ? v.onModuleWillStart() : null),
			);
			await Promise.all(moduleWillStartIterator);

			// Synchronously start modules
			this.modules.forEach((v) => (v.start ? v.start() : null));
			this.client.logger.log("Done.");
		});
	}

	/**
	 * Adds a module to the client
	 * @param {Module | ModuleConstructor} module
	 */
	public addModule(module: ModuleConstructor | Module) {
		let m: Module;
		if (module instanceof Module) {
			m = module;
		} else {
			m = new module(this.client);
		}
		this.modules.set(m.moduleName, m);
	}

	/**
	 * Creates a new module
	 * @param {object} data - Module data
	 * @param {string} data.name - Name of the module
	 */
	public createModule(name: string, start: () => any) {
		const moduleToAdd = new Module(this.client);
		moduleToAdd.moduleName = name;
		moduleToAdd.start = start;
		this.addModule(moduleToAdd);
	}
	/**
	 * Number of modules stored
	 */
	get moduleCount() {
		return this.modules.size;
	}
}
