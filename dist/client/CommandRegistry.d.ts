import { Collection } from "discord.js";
import { Command } from "../structures/Command";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { SparklClient } from "./Client";
export declare class CommandRegistry {
    client: SparklClient;
    commands: Collection<number, Command<any>>;
    constructor(client: SparklClient);
    addCommand<S extends SyntaxParsable[]>(command: Command<S>): void;
    loadCommandsIn(path: string): Promise<number>;
    private execute;
}
