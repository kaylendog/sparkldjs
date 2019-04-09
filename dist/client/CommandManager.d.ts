import { Command } from "../structures/Command";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { TailClient } from "./Client";
export declare class CommandManager {
    client: TailClient;
    private commands;
    constructor(client: TailClient);
    addCommand<S extends SyntaxParsable[]>(command: Command<S>): void;
    private execute;
}
