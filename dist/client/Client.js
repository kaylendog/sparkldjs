"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const events_1 = require("events");
const Command_1 = require("../structures/Command");
const ConfigPlugin_1 = require("../structures/ConfigPlugin");
const Logger_1 = require("../util/Logger");
const CommandManager_1 = require("./CommandManager");
const PluginManager_1 = require("./PluginManager");
const DEFAULT_OPTIONS = {
    loggerDebugLevel: false,
    name: "tailjs",
};
/**
 * The main client used to interact with the API.
 */
class TailClient extends events_1.EventEmitter {
    /**
     * @param {TailClientOptions} [options] Options for the client
     */
    constructor(options) {
        super();
        this.options = Object.assign(DEFAULT_OPTIONS, options);
        // Public declarations
        this.logger = new Logger_1.Logger(this);
        // Private declarations
        this.discord = new discord_js_1.Client();
        this.pluginManager = new PluginManager_1.PluginManager(this);
        this.commandManager = new CommandManager_1.CommandManager(this);
        this.config = new ConfigPlugin_1.ConfigPlugin(this, {
            commandPermmisions: {},
            guilds: {},
        }, {
            guilds: {
                permissions: {},
                prefix: "!",
            },
        });
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
    async start(token) {
        if (this.options.loggerDebugLevel) {
            this.logger.log("Starting...");
        }
        else {
            this.logger.log("Starting... |", chalk_1.default.red("t") +
                chalk_1.default.yellow("a") +
                chalk_1.default.green("i") +
                chalk_1.default.cyan("l") +
                chalk_1.default.blue("j") +
                chalk_1.default.magenta("s"), "0.1.0");
        }
        if (token) {
            this.options.token = token;
        }
        else if (!this.options.token) {
            return this.logger.error("No token provided - cannot log in.");
        }
        logSettings(this);
        await this.discord.login(this.options.token).catch((err) => {
            this.logger.error(err);
            return this;
        });
        this.logger.success("Connected and logged into Discord API.");
        this.logger.debug(`Authed for user ${chalk_1.default.green(this.discord.user.tag)}, ${this.discord.user.id}`);
        if (!this.discord.user.bot) {
            this.logger.warn("The automation of user accounts is in violation of Discord's terms of service!");
            this.logger.warn("It is not recommended to proceed with your current token, as your account may be terminated.");
            this.logger.warn("You can read more here: https://discordapp.com/guidelines");
        }
        this.emit("ready");
        return this;
    }
    /**
     * Disconnects the client from the API
     */
    disconnect() {
        this.discord.destroy();
        return this;
    }
    /**
     * Adds a plugin to the client
     */
    plugin(name, start) {
        this.pluginManager.createPlugin(name, start);
        return this;
    }
    /**
     * Adds a plugin to the client
     */
    addPlugin(...modules) {
        modules.forEach((m) => this.pluginManager.addPlugin(m));
        return this;
    }
    /**
     * Creates and adds a command to the client
     * @param {string} name
     * @param {number} permissionLevel
     * @param {string|string[]|BaseType[]} syntax - Syntax to use for the command
     * @param {CommandExecutable<Syntax>} executable - Callback to run when the command is triggered
     */
    command(name, permissionLevel, syntax, executable) {
        return this.commandManager.addCommand(new Command_1.Command({
            executable,
            name,
            permissionLevel,
            syntax,
        }));
    }
    /**
     * Adds a command to the client
     * @param {Command} command - Command to add
     */
    addCommand(command) {
        this.commandManager.addCommand(command);
    }
    /**
     * Used for sending messages between plugins
     * @param {string} dest - Destination module
     * @param {string }type - Event type
     * @param {...any[]} data - Data to send
     */
    sendMessage(dest, type, ...data) {
        return this.pluginManager.sendMessage(dest, type, ...data);
    }
    /**
     * Adds a config plugin to the client
     * @param {ConfigPlugin|ConfigPluginConstructor} config - Config plugin to use
     */
    useConfigPlugin(config) {
        this.config = config(this);
        return this;
    }
}
exports.TailClient = TailClient;
function logSettings(client) {
    const headerString = `---------=[ ${chalk_1.default.red("t") +
        chalk_1.default.yellow("a") +
        chalk_1.default.green("i") +
        chalk_1.default.cyan("l") +
        chalk_1.default.blue("j") +
        chalk_1.default.magenta("s")} 0.1.0 ]=---------`;
    client.logger.debug(headerString);
    client.logger.debug("Using the following settings:");
    Object.keys(client.options).forEach((key) => {
        const res = key.replace(/([A-Z])/g, " $1");
        client.logger.debug(` - ${chalk_1.default.cyan(res.charAt(0).toUpperCase() + res.slice(1))}: ${
        // @ts-ignore
        client.options[key]}`);
    });
    client.logger.debug("-".repeat(`---------=[ tailjs 0.1.0 ]=---------`.length));
}
