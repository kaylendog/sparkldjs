import chalk from "chalk";
import { Client, ClientOptions, Message } from "discord.js";
import * as winston from "winston";

import { PermissionError } from "../errors/PermissionError";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { Command, CommandExecutable } from "../structures/Command";
import { Plugin, PluginConstructor } from "../structures/plugins/Plugin";
import { ConfigProvider } from "../structures/providers/ConfigProvider";
import { DefaultConfigProvider } from "../structures/providers/DefaultConfigProvider";
import { BaseType } from "../types/BaseType";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { DEFAULT_OPTIONS, VERSION } from "../util/Constants";
import { createLogger, rainbow } from "../util/Util";
import { CommandRegistry } from "./CommandRegistry";
import { PluginManager } from "./PluginManager";

interface SparklClientOptions extends ClientOptions {
	token?: string;
	name?: string;
	loggerDebugLevel?: 0 | 1 | 2;
	permissionOverrides?: string[];
	syntaxErrorHandler?: (m: Message, err: SyntaxParseError) => any;
	permissionErrorHandler?: (m: Message, err: PermissionError) => any;
}

/**
 * The main client used to interact with the API.
 */
export class SparklClient extends Client {
	public options: SparklClientOptions;
	public logger: winston.Logger;

	public config: ConfigProvider<any>;
	public registry: CommandRegistry;

	private pluginManager: PluginManager;
	private pluginHandlerMap: Map<string, any[]>;

	/**
	 * @param {SparklClientOptions} [options] Options for the client
	 */
	constructor(options?: SparklClientOptions) {
		super(options);
		this.options = Object.assign(DEFAULT_OPTIONS, options);
		// Public declarations
		this.logger = createLogger(this.options.loggerDebugLevel || 0);
		this.config = new DefaultConfigProvider();

		// Private declarations
		this.pluginManager = new PluginManager(this);
		this.registry = new CommandRegistry(this);
		this.pluginHandlerMap = new Map();

		this.on("debug", (m: string) => this.logger.debug(m));
		this.on("error", (e: Error) => {
			this.logger.error(e.message);
			this.logger.debug(e);
		});
	}

	/**
	 * Triggers the login process with the Discord API. Use this to start your bot.
	 * @param {string} [token] - The bot token to use.
	 * @returns {Promise<SparklClient>}
	 * @example
	 * client.login("token here").then(() => {
	 * 		console.log("Logged in!");
	 * });
	 */
	public async login(token?: string): Promise<string> {
		if (this.options.loggerDebugLevel) {
			this.logger.info("Starting...");
		} else {
			this.logger.info(
				"Starting... | " + rainbow("sparkldjs") + " v" + VERSION,
			);
		}

		if (!token && !this.options.token) {
			throw TypeError("No token provided");
		}

		if (token) {
			this.options.token = token;
		}

		logSettings(this);

		await super.login(this.options.token).catch((err) => {
			this.logger.error(err);
			this.logger.error("Failed to connect to Discord.");
			process.exit(err.code);
			return token;
		});

		this.logger.info("Connected and logged into Discord API.");
		this.logger.debug(
			`Authed for user ${chalk.green(this.user.tag)}, ${this.user.id}`,
		);

		// Initialise config
		this.config.init(this);

		if (!this.user.bot) {
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

		return this.options.token as string;
	}

	/**
	 * Disconnects the client from the API
	 */
	public disconnect() {
		super.destroy();
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
	public addPlugin(...modules: Array<Plugin | PluginConstructor>) {
		modules.forEach((m) => this.pluginManager.addPlugin(m));
		return this;
	}

	/**
	 * Add a command to the client
	 * @param name Name of the command
	 * @param permissionLevel Permission of the command
	 * @param syntax Command's syntax
	 * @param executable The executable to run when the command is triggered
	 * @param options Customization options
	 */
	public command<Syntax extends SyntaxParsable[]>(
		name: string,
		permissionLevel: number,
		syntax: string | string[] | BaseType[],
		executable: CommandExecutable<Syntax>,
		options?: { plugin: string },
	) {
		const group =
			name.split(".").length > 1
				? name.split(".").slice(0, name.split(".").length - 1)
				: undefined;
		const nameMinusGroup = name.split(".").pop() || name;

		return this.registry.addCommand(
			new Command<Syntax>({
				executable,
				group,
				name: nameMinusGroup,
				permissionLevel,
				syntax,

				plugin: options ? options.plugin : undefined,
			}),
		);
	}

	/**
	 * Adds a config plugin to the client
	 * @param {ConfigPlugin|ConfigPluginConstructor} config - Config plugin to use
	 */
	public useConfigProvider(provider: ConfigProvider<any>) {
		this.config = provider;
		return this;
	}

	public on(eventName: string, listener: any, plugin?: string) {
		super.on(eventName, listener);

		if (plugin) {
			let pluginListeners = this.pluginHandlerMap.get(plugin);
			if (pluginListeners) {
				pluginListeners.push(listener);
			} else {
				pluginListeners = [listener];
			}
			this.pluginHandlerMap.set(plugin, pluginListeners);
		}

		return this;
	}
}

function logSettings(client: SparklClient) {
	const headerString = `---------=[ ${rainbow(
		"sparkldjs",
	)} ${VERSION} ]=---------`;
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
		"-".repeat(`---------=[ sparkldjs ${VERSION} ]=---------`.length),
	);
}
