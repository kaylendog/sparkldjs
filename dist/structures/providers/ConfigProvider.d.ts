import { Guild } from "discord.js";
import { SparklClient } from "../../client/Client";
export interface BaseGuildConfig {
    [x: string]: any;
    prefix: string;
}
export declare class ConfigProvider<GuildConfig extends BaseGuildConfig = {
    prefix: "!";
}> {
    /**
     * Obtains the ID of the provided guild, or throws an error if it isn't valid
     * @param {Guild|string} guild - Guild to get the ID of
     * @return {string} ID of the guild, or 'global'
     */
    static getGuildID(guild: Guild | string | null): string;
    constructor();
    /**
     * Initialises the provider by connecting to databases and/or caching all data in memory.
     * {@link SparklClient#setProvider} will automatically call this once the client is ready.
     * @param {SparklClient} client - Client that will be using the provider
     * @return {Promise<void>}
     * @abstract
     */
    init(client: SparklClient): void;
    /**
     * Destroys the provider, removing any event listeners.
     * @return {Promise<void>}
     * @abstract
     */
    destroy(): void;
    /**
     * Obtains a setting for a guild
     * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
     * @param {string} key - Name of the setting
     * @param {*} [defVal] - Value to default to if the setting isn't set on the guild
     * @return {*}
     * @abstract
     */
    get(guild: Guild | string, key: string, defVal: any): any;
    /**
     * Sets a setting for a guild
     * @param {Guild|string} guild - Guild to associate the setting with (or 'global')
     * @param {string} key - Name of the setting
     * @param {*} val - Value of the setting
     * @return {Promise<*>} New value of the setting
     * @abstract
     */
    set(guild: Guild | string, key: string, val: any): Promise<any>;
    /**
     * Removes a setting from a guild
     * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
     * @param {string} key - Name of the setting
     * @return {Promise<*>} Old value of the setting
     * @abstract
     */
    remove(guild: Guild | string, key: string): Promise<any>;
    /**
     * Removes all settings in a guild
     * @param {Guild|string} guild - Guild to clear the settings of
     * @return {Promise<void>}
     * @abstract
     */
    clear(guild: Guild | string): Promise<void>;
}
