import { Client } from "discord.js";
import { Command } from "../structures/Command";
import { TailClient } from "./Client";
export declare class CommandManager {
    client: TailClient;
    private commands;
    private guildStore;
    constructor(client: TailClient, djs: Client);
    addCommand<S extends []>(command: Command<S>): void;
    private execute;
}
