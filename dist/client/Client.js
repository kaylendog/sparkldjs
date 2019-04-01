"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const Command_1 = require("../structures/Command");
const Logger_1 = require("../util/Logger");
const CommandManager_1 = require("./CommandManager");
const ModuleManager_1 = require("./ModuleManager");
const DEFAULT_OPTIONS = {
    loggerDebugLevel: false,
    name: "tailjs",
};
/**
 * The main client used to interact with the API.
 */
class TailClient extends discord_js_1.Client {
    /**
     * @param {TailClientOptions} [tailOptions] Options for the client
     */
    constructor(tailOptions) {
        super();
        this.tailOptions = Object.assign(DEFAULT_OPTIONS, tailOptions);
        // Public declarations
        this.logger = new Logger_1.Logger(this);
        // Private declarations
        this.djs = new discord_js_1.Client();
        this.moduleManager = new ModuleManager_1.ModuleManager(this);
        this.commandManager = new CommandManager_1.CommandManager(this, this.djs);
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
    async start(token) {
        if (this.tailOptions.loggerDebugLevel) {
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
            this.tailOptions.token = token;
        }
        else if (!this.tailOptions.token) {
            return this.logger.error("No token provided - cannot log in.");
        }
        logSettings(this);
        await this.djs.login(this.tailOptions.token).catch((err) => {
            this.logger.error(err);
            return this;
        });
        this.logger.success("Connected and logged into Discord API.");
        this.logger.debug(`Authed for user ${chalk_1.default.green(this.djs.user.tag)}, ${this.djs.user.id}`);
        if (!this.djs.user.bot) {
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
        this.djs.destroy();
        return this;
    }
    /**
     * Adds a module to the client
     */
    module(name, start) {
        this.moduleManager.createModule(name, start);
        return this;
    }
    /**
     * Adds a module to the client
     */
    addModule(...modules) {
        modules.forEach((m) => this.moduleManager.addModule(m));
        return this;
    }
    command(name, permLevel, syntax, executable) {
        return this.commandManager.addCommand(new Command_1.Command(this, {
            executable,
            name,
            syntax,
        }));
    }
    addCommand(command) {
        this.commandManager.addCommand(command);
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
    Object.keys(client.tailOptions).forEach((key) => {
        const res = key.replace(/([A-Z])/g, " $1");
        client.logger.debug(` - ${chalk_1.default.cyan(res.charAt(0).toUpperCase() + res.slice(1))}: ${
        // @ts-ignore
        client.tailOptions[key]}`);
    });
    client.logger.debug("-".repeat(`---------=[ tailjs 0.1.0 ]=---------`.length));
}
