import { Command } from "../structures/Command";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { SparklClient } from "./Client";
export declare class CommandManager {
    client: SparklClient;
    private commands;
    constructor(client: SparklClient);
    addCommand<S extends SyntaxParsable[]>(command: Command<S>): void;
    private execute;
}
