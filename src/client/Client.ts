import chalk from "chalk";
import { Client } from "discord.js";
import { PathLike } from "fs";

import { Command, CommandExecutable } from "../structures/Command";
import { ModuleConstructor } from "../structures/Module";
import { BaseType } from "../types/BaseType";
import { Logger } from "../util/Logger";
import { CommandManager } from "./CommandManager";
import { ModuleManager } from "./ModuleManager";

interface TailClientOptions {
	token?: string;
	name?: string;
	loggerDebugLevel?: false | "quiet" | "verbose";
	loggerOutputToFile?: false | PathLike;
	permissionOverrides?: string[];
}
const DEFAULT_OPTIONS: TailClientOptions = {
	loggerDebugLevel: false,
	name: "tailjs",
};

/**
 * The main client used to interact with the API.
 */
export class TailClient extends Client {
	public tailOptions: TailClientOptions;
	public logger: Logger;

	private djs: Client;
	private moduleManager: ModuleManager;
	private commandManager: CommandManager;
	/**
	 * @param {TailClientOptions} [tailOptions] Options for the client
	 */
	constructor(tailOptions?: TailClientOptions) {
		super();
		this.tailOptions = Object.assign(DEFAULT_OPTIONS, tailOptions);

		// Public declarations
		this.logger = new Logger(this);

		// Private declarations
		this.djs = new Client();
		this.moduleManager = new ModuleManager(this);
		this.commandManager = new CommandManager(this, this.djs);

		this.djs.on("debug", (m) => this.logger.debug(m, "verbose"));
	}

	/**
	 * Triggers the login process with the Discord API. Use this to start your bot.
	 * @param {string} [token] - The bot token to use.
	 * @returns {Promise<TailClient>}
	 * @example
	 * client.login("token here").then(() => {
	 * 		console.log("Logged in!");
	 * });
	 */
	public async start(token?: string) {
		if (this.tailOptions.loggerDebugLevel) {
			this.logger.log("Starting...");
		} else {
			this.logger.log(
				"Starting... |",
				chalk.red("t") +
					chalk.yellow("a") +
					chalk.green("i") +
					chalk.cyan("l") +
					chalk.blue("j") +
					chalk.magenta("s"),
				"0.1.0",
			);
		}
		if (token) {
			this.tailOptions.token = token;
		} else if (!this.tailOptions.token) {
			return this.logger.error("No token provided - cannot log in.");
		}

		logSettings(this);

		await this.djs.login(this.tailOptions.token).catch((err) => {
			this.logger.error(err);
			return this;
		});
		this.logger.success("Connected and logged into Discord API.");
		this.logger.debug(
			`Authed for user ${chalk.green(this.djs.user.tag)}, ${
				this.djs.user.id
			}`,
		);

		if (!this.djs.user.bot) {
			this.logger.warn(
				"The automation of user accounts is in violation of Discord's terms of service!",
			);
			this.logger.warn(
				"It is not recommended to proceed with your current token, as your account may be terminated.",
			);
			this.logger.warn(
				"You can read more here: https://discordapp.com/guidelines",
			);
		}

		this.emit("ready");

		return this;
	}

	/**
	 * Disconnects the client from the API
	 */
	public disconnect() {
		this.djs.destroy();
		return this;
	}

	/**
	 * Adds a module to the client
	 */
	public module(name: string, start: () => any) {
		this.moduleManager.createModule(name, start);
		return this;
	}
	/**
	 * Adds a module to the client
	 */
	public addModule(...modules: ModuleConstructor[]) {
		modules.forEach((m) => this.moduleManager.addModule(m));
		return this;
	}

	public command<Syntax extends []>(
		name: string,
		permLevel: number,
		syntax: string | string[] | BaseType[],
		executable: CommandExecutable<Syntax>,
	) {
		return this.commandManager.addCommand(
			new Command<Syntax>(this, {
				executable,
				name,
				syntax,
			}),
		);
	}

	public addCommand(command: Command<[]>) {
		this.commandManager.addCommand(command);
	}
}

function logSettings(client: TailClient) {
	const headerString = `---------=[ ${chalk.red("t") +
		chalk.yellow("a") +
		chalk.green("i") +
		chalk.cyan("l") +
		chalk.blue("j") +
		chalk.magenta("s")} 0.1.0 ]=---------`;
	client.logger.debug(headerString);
	client.logger.debug("Using the following settings:");
	Object.keys(client.tailOptions).forEach((key) => {
		const res = key.replace(/([A-Z])/g, " $1");
		client.logger.debug(
			` - ${chalk.cyan(res.charAt(0).toUpperCase() + res.slice(1))}: ${
				// @ts-ignore
				client.tailOptions[key]
			}`,
		);
	});
	client.logger.debug(
		"-".repeat(`---------=[ tailjs 0.1.0 ]=---------`.length),
	);
}
