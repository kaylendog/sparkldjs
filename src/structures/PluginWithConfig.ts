import { TailClient } from "../client/Client";
import { Plugin } from "./Plugin";

export declare interface PluginWithConfig<Config extends {}> extends Plugin {
	onConfigUpdate(config?: Config, oldConfig?: Config): any;
}

/**
 * A Plugin with a built-in config system.
 */
export class PluginWithConfig<Config extends {}> extends Plugin {
	public config: Readonly<Config>;

	constructor(client: TailClient) {
		super(client);
		this.config = {} as Config;
	}
	/**
	 * Updates the Plugin's config.
	 * @param {Config} config - The new config to patch into the Plugin
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
		if (this.onConfigUpdate) {
			this.onConfigUpdate(this.config, old);
		}
	}
}
