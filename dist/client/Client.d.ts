import { Client, Message } from "discord.js";
import { EventEmitter } from "events";
import { PathLike } from "fs";
import { PermissionError } from "../errors/PermissionError";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { Command, CommandExecutable } from "../structures/Command";
import { BaseConfig, BaseDefaultConfig, BaseGuildConfig, ConfigPlugin } from "../structures/ConfigPlugin";
import { Plugin, PluginConstructor } from "../structures/Plugin";
import { BaseType } from "../types/BaseType";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { Logger } from "../util/Logger";
interface SparklClientOptions {
    token?: string;
    name?: string;
    loggerDebugLevel?: false | "quiet" | "verbose";
    loggerOutputToFile?: false | PathLike;
    permissionOverrides?: string[];
    syntaxErrorHandler?: (m: Message, err: SyntaxParseError) => any;
    permissionErrorHandler?: (m: Message, err: PermissionError) => any;
}
/**
 * The main client used to interact with the API.
 */
export declare class SparklClient extends EventEmitter {
    options: SparklClientOptions;
    logger: Logger;
    config: ConfigPlugin<BaseConfig<BaseGuildConfig>, BaseGuildConfig, BaseDefaultConfig<BaseGuildConfig>>;
    discord: Client;
    private pluginManager;
    private commandManager;
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
    start(token?: string): Promise<void | this>;
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
     * Creates and adds a command to the client
     * @param {string} name
     * @param {number} permissionLevel
     * @param {string|string[]|BaseType[]} syntax - Syntax to use for the command
     * @param {CommandExecutable<Syntax>} executable - Callback to run when the command is triggered
     */
    command<Syntax extends SyntaxParsable[]>(name: string, permissionLevel: number, syntax: string | string[] | BaseType[], executable: CommandExecutable<Syntax>): void;
    /**
     * Adds a command to the client
     * @param {Command} command - Command to add
     */
    addCommand(command: Command<SyntaxParsable[]>): void;
    /**
     * Used for sending messages between plugins
     * @param {string} dest - Destination module
     * @param {string }type - Event type
     * @param {...any[]} data - Data to send
     */
    sendMessage(dest: string, type: string, ...data: any[]): void;
    /**
     * Adds a config plugin to the client
     * @param {ConfigPlugin|ConfigPluginConstructor} config - Config plugin to use
     */
    useConfigPlugin<S extends BaseConfig<G>, G extends BaseGuildConfig, D extends BaseDefaultConfig<G>>(config: (c: this) => ConfigPlugin<S, G, D>): this;
}
export {};
