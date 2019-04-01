import { GuildResolvable } from "discord.js";
import {
	BaseConfig,
	BaseDefaultConfig,
	ConfigPlugin,
} from "../src/structures/ConfigPlugin";

interface BotConfig extends BaseConfig {
	name: string;
}

export const DEFAULT_CONFIG: BaseDefaultConfig = {
	guilds: {
		prefix: "!",
	},
};

export class Config extends ConfigPlugin<BotConfig, BaseDefaultConfig> {
	public fetchGuildConfig(g: GuildResolvable) {
		return {
			prefix: "!",
		};
	}
}
