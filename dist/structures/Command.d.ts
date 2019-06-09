import { Message } from "discord.js";
import { SparklClient } from "../client/Client";
import { BaseType } from "../types/BaseType";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { SyntaxParser } from "./SyntaxParser";
export declare type CommandExecutable<S extends SyntaxParsable[]> = (c: SparklClient, m: Message, a: S) => any;
interface CommandOptions<S extends SyntaxParsable[]> {
    name: string;
    syntax: string | string[] | BaseType[];
    executable: CommandExecutable<S>;
    permissionLevel: number;
    aliases?: string[];
    guild?: string | string[];
    group?: string[];
    syntaxParser?: SyntaxParser;
    plugin?: string;
}
/**
 * Class enabling users to directly interact with the client from Discord
 */
export declare class Command<S extends SyntaxParsable[]> {
    options: CommandOptions<S>;
    private parser;
    constructor(options: CommandOptions<S>);
    /**
     *
     * @param {SparklClient} client The client object
     * @param {Message} message The message triggering the command
     * @param {string[]} args Arguments parsed to the command
     */
    execute(client: SparklClient, message: Message, args: string[]): Promise<any>;
    hasAlias(s: string): boolean;
}
export {};
