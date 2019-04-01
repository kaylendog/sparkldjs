import { PluginWithConfig, TailClient } from "../src";

interface BasePluginConfig {
	prefix: string;
}

export class BasePlugin extends PluginWithConfig<BasePluginConfig> {
	public static pluginName = "BasePlugin";
	constructor(client: TailClient) {
		super(client);
		this.config = {
			prefix: "!",
		};
	}

	public start() {
		this.logger.log("BasePlugin loaded.");
	}
}
