import { Client, ClientOptions, Message } from "discord.js";
import * as winston from "winston";
import { PermissionError } from "../errors/PermissionError";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { ConfigProvider } from "../structures/ConfigProvider";
import { Plugin, PluginConstructor } from "../structures/Plugin";
import { CommandRegistry } from "./CommandRegistry";
interface SparklClientOptions extends ClientOptions {
    token?: string;
    name?: string;
    loggerDebugLevel?: 0 | 1 | 2;
    permissionOverrides?: string[];
    syntaxErrorHandler?: (m: Message, err: SyntaxParseError) => any;
    permissionErrorHandler?: (m: Message, err: PermissionError) => any;
}
/**
 * The main client used to interact with the API.
 */
export declare class SparklClient extends Client {
    options: SparklClientOptions;
    logger: winston.Logger;
    config: ConfigProvider<any>;
    registry: CommandRegistry;
    private pluginManager;
    private pluginHandlerMap;
    /**
     * @param {SparklClientOptions} [options] Options for the client
     */
    constructor(options?: SparklClientOptions);
    /**
     * Triggers the login process with the Discord API. Use this to start your bot.
     * @param {string} [token] - The bot token to use.
     * @returns {Promise<SparklClient>}
     * @example
     * client.login("token here").then(() => {
     * 		console.log("Logged in!");
     * });
     */
    login(token?: string): Promise<string>;
    /**
     * Disconnects the client from the API
     */
    disconnect(): this;
    /**
     * Adds a plugin to the client
     */
    plugin(name: string, start: () => any): this;
    /**
     * Adds a plugin to the client
     */
    addPlugin(...modules: Array<Plugin | PluginConstructor>): this;
    /**
     * Adds a config plugin to the client
     * @param {ConfigPlugin|ConfigPluginConstructor} config - Config plugin to use
     */
    useConfigProvider(provider: ConfigProvider<any>): this;
    on(eventName: string, listener: any, plugin?: string): this;
}
export {};
