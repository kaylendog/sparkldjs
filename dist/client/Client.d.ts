import { Client } from "discord.js";
import { PathLike } from "fs";
import { Command, CommandExecutable } from "../structures/Command";
import { ModuleConstructor } from "../structures/Module";
import { BaseType } from "../types/BaseType";
import { Logger } from "../util/Logger";
interface TailClientOptions {
    token?: string;
    name?: string;
    loggerDebugLevel?: false | "quiet" | "verbose";
    loggerOutputToFile?: false | PathLike;
    permissionOverrides?: string[];
}
/**
 * The main client used to interact with the API.
 */
export declare class TailClient extends Client {
    tailOptions: TailClientOptions;
    logger: Logger;
    private djs;
    private moduleManager;
    private commandManager;
    /**
     * @param {TailClientOptions} [tailOptions] Options for the client
     */
    constructor(tailOptions?: TailClientOptions);
    /**
     * Triggers the login process with the Discord API. Use this to start your bot.
     * @param {string} [token] - The bot token to use.
     * @returns {Promise<TailClient>}
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
     * Adds a module to the client
     */
    module(name: string, start: () => any): this;
    /**
     * Adds a module to the client
     */
    addModule(...modules: ModuleConstructor[]): this;
    command<Syntax extends []>(name: string, permLevel: number, syntax: string | string[] | BaseType[], executable: CommandExecutable<Syntax>): void;
    addCommand(command: Command<[]>): void;
}
export {};
