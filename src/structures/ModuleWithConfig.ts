import { TailClient } from "../client/Client";
import { Module } from "./Module";

export declare interface ModuleWithConfig<Config extends {}> extends Module {
	onConfigUpdate(config?: Config, oldConfig?: Config): any;
}

/**
 * A module with a built-in config system.
 */
export class ModuleWithConfig<Config extends {}> extends Module {
	public config: Readonly<Config>;

	constructor(client: TailClient) {
		super(client);
		this.config = {} as Config;
	}
	/**
	 * Updates the module's config.
	 * @param {Config} config - The new config to patch into the module
	 */
	public updateConfig<K extends keyof Config>(
		config:
			| ((
					prevConfig: Readonly<Config>,
			  ) => Pick<Config, K> | Config | null)
			| (Pick<Config, K> | Config | null),
	) {
		const old = this.config;
		this.config = Object.assign(this.config, config);
		this.onConfigUpdate(this.config, old);
	}
}
