import { TailClient } from "../client/Client";
import { Command, CommandExecutable } from "./Command";

export declare interface Module {
	moduleName: string;
	client: TailClient;

	start(): any;
	onModuleWillStart(): any;
}

export type ModuleConstructor = new (c: TailClient) => Module;

export class Module {
	public static moduleName: string;
	public client: TailClient;

	constructor(client: TailClient) {
		this.client = client;
	}

	/**
	 * Adds a command to the client
	 * @param {Command<Syntax>} command - Command to add
	 */
	public addCommand<Syntax extends []>(command: Command<Syntax>) {
		this.client.addCommand(command);
	}
	/**
	 * Adds a command to the client
	 * @param {string} name - Name of the command
	 * @param {number} permLevel - Permission required to run the command
	 * @param {CommandExecutable<Syntax>} executable - Command executable
	 */
	public command<Syntax extends []>(
		name: string,
		permLevel: number,
		exec: CommandExecutable<Syntax>,
	) {
		this.client.command(name, permLevel, exec);
	}
}

export function module(name: string, onStart: () => any) {
	return (client: TailClient) => {
		const m = new Module(client);
		m.moduleName = name;
		m.start = onStart;
		return m;
	};
}
