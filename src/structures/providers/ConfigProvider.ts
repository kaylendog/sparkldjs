import { Guild } from "discord.js";

import { SparklClient } from "../../client/Client";

export interface BaseGuildConfig {
	[x: string]: any;
	prefix: string;
}

export class ConfigProvider<
	GuildConfig extends BaseGuildConfig = { prefix: "!" }
> {
	/**
	 * Obtains the ID of the provided guild, or throws an error if it isn't valid
	 * @param {Guild|string} guild - Guild to get the ID of
	 * @return {string} ID of the guild, or 'global'
	 */
	public static getGuildID(guild: Guild | string | null) {
		if (guild instanceof Guild) {
			return guild.id;
		}
		if (guild === "global" || guild === null) {
			return "global";
		}
		if (typeof guild === "string" && !isNaN(parseInt(guild, 10))) {
			return guild;
		}
		throw new TypeError(
			'Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.',
		);
	}
	constructor() {
		if (this.constructor.name === "ConfigProvider") {
			throw new Error("The base ConfigProvider cannot be instantiated.");
		}
	}

	/**
	 * Initialises the provider by connecting to databases and/or caching all data in memory.
	 * {@link SparklClient#setProvider} will automatically call this once the client is ready.
	 * @param {SparklClient} client - Client that will be using the provider
	 * @return {Promise<void>}
	 * @abstract
	 */
	public init(client: SparklClient) {
		throw new Error(
			`${this.constructor.name} doesn't have an init method.`,
		);
	}

	/**
	 * Destroys the provider, removing any event listeners.
	 * @return {Promise<void>}
	 * @abstract
	 */
	public destroy() {
		throw new Error(
			`${this.constructor.name} doesn't have a destroy method.`,
		);
	}

	/**
	 * Obtains a setting for a guild
	 * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
	 * @param {string} key - Name of the setting
	 * @param {*} [defVal] - Value to default to if the setting isn't set on the guild
	 * @return {*}
	 * @abstract
	 */
	public get(guild: Guild | string, key: string, defVal: any): any {
		throw new Error(`${this.constructor.name} doesn't have a get method.`);
	}

	/**
	 * Sets a setting for a guild
	 * @param {Guild|string} guild - Guild to associate the setting with (or 'global')
	 * @param {string} key - Name of the setting
	 * @param {*} val - Value of the setting
	 * @return {Promise<*>} New value of the setting
	 * @abstract
	 */
	public set(guild: Guild | string, key: string, val: any): Promise<any> {
		throw new Error(`${this.constructor.name} doesn't have a set method.`);
	}

	/**
	 * Removes a setting from a guild
	 * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
	 * @param {string} key - Name of the setting
	 * @return {Promise<*>} Old value of the setting
	 * @abstract
	 */
	public remove(guild: Guild | string, key: string): Promise<any> {
		throw new Error(
			`${this.constructor.name} doesn't have a remove method.`,
		);
	}

	/**
	 * Removes all settings in a guild
	 * @param {Guild|string} guild - Guild to clear the settings of
	 * @return {Promise<void>}
	 * @abstract
	 */
	public clear(guild: Guild | string): Promise<void> {
		throw new Error(
			`${this.constructor.name} doesn't have a clear method.`,
		);
	}
}
