import chalk from "chalk";
import { Client } from "discord.js";
import { EventEmitter } from "events";
import { PathLike } from "fs";

import { Command, CommandExecutable } from "../structures/Command";
import { BaseConfig, BaseDefaultConfig, ConfigPlugin } from "../structures/ConfigPlugin";
import { PluginConstructor } from "../structures/Plugin";
import { BaseType } from "../types/BaseType";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { Logger } from "../util/Logger";
import { CommandManager } from "./CommandManager";
import { PluginManager } from "./PluginManager";

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
export class TailClient extends EventEmitter {
	public options: TailClientOptions;
	public logger: Logger;

	public config?: ConfigPlugin<BaseConfig, BaseDefaultConfig>;

	public discord: Client;

	private pluginManager: PluginManager;
	private commandManager: CommandManager;
	/**
	 * @param {TailClientOptions} [options] Options for the client
	 */
	constructor(options?: TailClientOptions) {
		super();
		this.options = Object.assign(DEFAULT_OPTIONS, options);

		// Public declarations
		this.logger = new Logger(this);

		// Private declarations
		this.discord = new Client();
		this.pluginManager = new PluginManager(this);
		this.commandManager = new CommandManager(this);

		this.discord.on("debug", (m) => this.logger.debug(m, "verbose"));
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
		if (this.options.loggerDebugLevel) {
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
			this.options.token = token;
		} else if (!this.options.token) {
			return this.logger.error("No token provided - cannot log in.");
		}

		logSettings(this);

		await this.discord.login(this.options.token).catch((err) => {
			this.logger.error(err);
			return this;
		});
		this.logger.success("Connected and logged into Discord API.");
		this.logger.debug(
			`Authed for user ${chalk.green(this.discord.user.tag)}, ${
				this.discord.user.id
			}`,
		);

		if (!this.discord.user.bot) {
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
		this.discord.destroy();
		return this;
	}

	/**
	 * Adds a plugin to the client
	 */
	public plugin(name: string, start: () => any) {
		this.pluginManager.createPlugin(name, start);
		return this;
	}
	/**
	 * Adds a plugin to the client
	 */
	public addPlugin(...modules: PluginConstructor[] | Plugin[]) {
		modules.forEach((m) => this.pluginManager.addPlugin(m));
		return this;
	}

	/**
	 * Creates and adds a command to the client
	 * @param {string} name
	 * @param {number} permLevel
	 * @param {string|string[]|BaseType[]} syntax - Syntax to use for the command
	 * @param {CommandExecutable<Syntax>} executable - Callback to run when the command is triggered
	 */
	public command<Syntax extends SyntaxParsable[]>(
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

	/**
	 * Adds a command to the client
	 * @param {Command} command - Command to add
	 */
	public addCommand(command: Command<SyntaxParsable[]>) {
		this.commandManager.addCommand(command);
	}

	/**
	 * Used for sending messages between plugins
	 * @param {string} dest - Destination module
	 * @param {string }type - Event type
	 * @param {...any[]} data - Data to send
	 */
	public sendMessage(dest: string, type: string, ...data: any[]) {
		return this.pluginManager.sendMessage(dest, type, ...data);
	}

	/**
	 * Adds a config plugin to the client
	 * @param {ConfigPlugin|ConfigPluginConstructor} config - Config plugin to use
	 */
	public useConfigPlugin<S extends BaseConfig, D extends BaseDefaultConfig>(
		config: (c: this) => ConfigPlugin<S, D>,
	) {
		this.config = config(this);
		return this;
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
	Object.keys(client.options).forEach((key) => {
		const res = key.replace(/([A-Z])/g, " $1");
		client.logger.debug(
			` - ${chalk.cyan(res.charAt(0).toUpperCase() + res.slice(1))}: ${
				// @ts-ignore
				client.options[key]
			}`,
		);
	});
	client.logger.debug(
		"-".repeat(`---------=[ tailjs 0.1.0 ]=---------`.length),
	);
}
