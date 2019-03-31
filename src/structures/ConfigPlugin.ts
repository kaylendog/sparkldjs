import { Guild, GuildResolvable } from "discord.js";
import { TailClient } from "../client/Client";

interface BaseGuildConfig {
	prefix: string;
}

export interface BaseConfig {
	guilds?: {
		[x: string]: BaseGuildConfig;
	};
}

export interface BaseDefaultConfig {
	guilds: BaseGuildConfig;
}

export declare interface ConfigPlugin<
	S extends BaseConfig,
	D extends BaseDefaultConfig
> {
	fetchGuildConfig(
		id: GuildResolvable,
	): BaseGuildConfig | Promise<BaseGuildConfig>;
}

export type ConfigPluginConstructor<
	S extends BaseConfig,
	D extends BaseDefaultConfig
> = new (c: TailClient, conf: S, defaults: D) => ConfigPlugin<S, D>;

export class ConfigPlugin<S extends BaseConfig, D extends BaseDefaultConfig> {
	public client: TailClient;

	private config: S;
	private defaults: D;

	constructor(client: TailClient, config: S, defaults: D) {
		this.client = client;
		this.config = config;
		this.defaults = defaults;
	}

	public fetchGuildConfig(g: GuildResolvable) {
		if (g instanceof Guild) {
			return this.config.guilds
				? this.config.guilds[g.id] || this.defaults.guilds
				: this.defaults.guilds;
		} else {
			return this.config.guilds
				? this.config.guilds[g] || this.defaults.guilds
				: this.defaults.guilds;
		}
	}
}
