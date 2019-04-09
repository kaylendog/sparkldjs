import { Collection, Guild, GuildResolvable } from "discord.js";

import { TailClient } from "../client/Client";

export interface BaseGuildPermissions {
	commandPermissionOverrides?: {
		[x: string]: number;
	};
	users?: {
		[x: string]: number;
	};
	roles?: {
		[x: string]: number;
	};
}

export interface BaseGuildConfig {
	prefix: string;
	permissions: BaseGuildPermissions;
}

export interface BaseConfig<G extends BaseGuildConfig> {
	guilds: {
		[x: string]: G;
	};
	commandPermmisions: {
		[x: string]: number;
	};
}

export interface BaseDefaultConfig<G> {
	guilds: G;
}

export declare interface ConfigPlugin<
	S extends BaseConfig<G>,
	G extends BaseGuildConfig,
	D extends BaseDefaultConfig<G>
> {
	fetchGuildConfig(id: GuildResolvable): G | Promise<G>;
}

export type ConfigPluginConstructor<
	S extends BaseConfig<G>,
	G extends BaseGuildConfig,
	D extends BaseDefaultConfig<G>
> = new (c: TailClient, conf: S, defaults: D) => ConfigPlugin<S, G, D>;

export class ConfigPlugin<
	S extends BaseConfig<G>,
	G extends BaseGuildConfig,
	D extends BaseDefaultConfig<G>
> {
	public client: TailClient;

	protected config: S;
	protected defaults: D;

	constructor(client: TailClient, config: S, defaults: D) {
		this.client = client;
		this.config = config;
		this.defaults = defaults;
	}

	public fetchGuildConfig(g: GuildResolvable) {
		return this.config.guilds
			? this.config.guilds[g instanceof Guild ? g.id : g] ||
					this.defaults.guilds
			: this.defaults.guilds;
	}

	public async intialise() {
		return;
	}
}
