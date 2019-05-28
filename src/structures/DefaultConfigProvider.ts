import { Collection, Guild } from "discord.js";

import { SparklClient } from "../client/Client";
import { BaseGuildConfig, ConfigProvider } from "./ConfigProvider";

export class DefaultConfigProvider extends ConfigProvider {
	public config: Collection<string, BaseGuildConfig>;

	constructor() {
		super();
		this.config = new Collection();
	}
	public init(client: SparklClient) {
		client.guilds.map((v) =>
			this.config.has(v.id)
				? this.config.set(
						v.id,
						Object.assign({ prefix: "!" }, this.config.get(v.id)),
				  )
				: this.config.set(v.id, { prefix: "!" }),
		);
		return;
	}
	public destroy() {
		this.config.deleteAll();
	}
	public get(guild: Guild | string, key: string, defVal: any): any {
		const id = guild instanceof Guild ? guild.id : guild;

		const config = this.config.get(id);
		return config ? (config[key] ? config[key] : defVal) : defVal;
	}

	public async set(
		guild: Guild | string,
		key: string,
		val: any,
	): Promise<any> {
		const id = guild instanceof Guild ? guild.id : guild;

		if (!this.config.has(id)) {
			this.config.set(id, Object.assign({ prefix: "!" }, { [key]: val }));
		} else {
			let config = this.config.get(id);
			config = Object.assign(config, { [key]: val });
			this.config.set(id, config);
		}
	}
	public async remove(guild: Guild | string, key: string): Promise<any> {
		const id = guild instanceof Guild ? guild.id : guild;
		if (!this.config.has(id)) {
			return null;
		} else {
			const config = this.config.get(id) as BaseGuildConfig;
			if (!config[key]) {
				return null;
			} else {
				const val = config[key];
				delete config[key];
				return val;
			}
		}
	}

	public async clear(guild: Guild | string): Promise<void> {
		const id = guild instanceof Guild ? guild.id : guild;

		this.config.set(id, { prefix: "!" });
	}
}
