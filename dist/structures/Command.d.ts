import { Message } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType } from "../types/BaseType";
import { SyntaxParser } from "./SyntaxParser";
export declare type CommandExecutable<S extends []> = (m: Message, a: S) => any;
interface CommandOptions<S extends []> {
    name: string;
    syntax: string | string[] | BaseType[];
    executable: CommandExecutable<S>;
    guild?: string;
    group?: string[];
    syntaxParser?: SyntaxParser;
}
export declare class Command<S extends []> {
    client: TailClient;
    options: CommandOptions<S>;
    private parser;
    constructor(client: TailClient, options: CommandOptions<S>);
    execute(m: Message, a: string[]): Promise<void>;
}
export {};
