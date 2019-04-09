import { Message } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType } from "../types/BaseType";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { SyntaxParser } from "./SyntaxParser";
export declare type CommandExecutable<S extends SyntaxParsable[]> = (c: TailClient, m: Message, a: S) => any;
interface CommandOptions<S extends SyntaxParsable[]> {
    name: string;
    syntax: string | string[] | BaseType[];
    executable: CommandExecutable<S>;
    permissionLevel: number;
    aliases?: string[];
    guild?: string | string[];
    group?: string[];
    syntaxParser?: SyntaxParser;
}
export declare class Command<S extends SyntaxParsable[]> {
    options: CommandOptions<S>;
    private parser;
    constructor(options: CommandOptions<S>);
    execute(c: TailClient, m: Message, a: string[]): Promise<any>;
    hasAlias(s: string): boolean;
}
export {};
