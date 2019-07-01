"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const util_1 = require("util");
const PermissionError_1 = require("../errors/PermissionError");
const verifyPermission = async (c, m, cmd) => {
    const permissionConfig = await c.config.get(m.guild, "permissions", {
        commandPermissionOverrides: {},
        roles: {},
        users: {},
    });
    let permlevel = cmd.options.permissionLevel;
    let highestPermission = 0;
    if (permissionConfig.commandPermissionOverrides &&
        Object.keys(permissionConfig.commandPermissionOverrides).indexOf(cmd.options.name) !== -1) {
        permlevel =
            permissionConfig.commandPermissionOverrides[cmd.options.name];
    }
    highestPermission =
        permissionConfig.users &&
            Object.keys(permissionConfig.users).indexOf(m.author.id) !== -1 &&
            permissionConfig.users[m.author.id] > highestPermission
            ? permissionConfig.users[m.author.id]
            : highestPermission;
    if (permissionConfig.roles) {
        Object.keys(permissionConfig.roles).map((v) => {
            const rolePerm = permissionConfig.roles[v];
            if (m.member.roles.get(v) && rolePerm) {
                highestPermission =
                    rolePerm > highestPermission ? rolePerm : highestPermission;
            }
        });
    }
    if (highestPermission >= permlevel) {
        return true;
    }
    else {
        throw new PermissionError_1.PermissionError({
            message: "NOT_ENOUGH_PERMISSION",
            receivedPermission: highestPermission,
            requiredPermission: permlevel,
        });
    }
};
let COMMAND_INCREMENT = 0;
class CommandRegistry {
    constructor(client) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
        this.client.on("message", async (m) => {
            if (!m.guild) {
                return;
            }
            const prefix = this.client.config.get(m.guild.id, "prefix", "!");
            if (m.cleanContent.startsWith(prefix)) {
                const args = m.content
                    .slice(prefix.length)
                    // .trim()
                    .split(/ +/g);
                if (args) {
                    this.execute(m, args);
                }
            }
        });
    }
    addCommand(command) {
        const existingCommand = this.commands.find((v) => v.options.name === command.options.name);
        // messy logic for testing if a command has already been added.
        if (existingCommand && command.options.guild) {
            // If existing command has an array of guilds
            if (existingCommand.options.guild instanceof Array) {
                existingCommand.options.guild.map((id) => {
                    if (command.options.guild instanceof Array) {
                        if (command.options.guild.indexOf(id) !== -1) {
                            this.client.logger.warn(`Command ${command.options.name} has been duplicated in guild ID ${id}`);
                        }
                    }
                    else if (command.options.guild === id) {
                        this.client.logger.warn(`Command ${command.options.name} has been duplicated in guild ID ${id}`);
                    }
                });
                // If it doesn't:
            }
            else if (command.options.guild instanceof Array) {
                if (command.options.guild.indexOf(existingCommand.options
                    .guild) !== -1) {
                    this.client.logger.warn(`Command ${command.options.name} has been duplicated in guild ID ${existingCommand.options.guild}`);
                }
            }
            else if (command.options.guild === existingCommand.options.guild) {
                this.client.logger.warn(`Command ${command.options.name} has been duplicated in guild ID ${existingCommand.options.guild}`);
            }
        }
        else {
            if (existingCommand &&
                existingCommand.options.group === command.options.group &&
                existingCommand.options.name === command.options.name) {
                this.client.logger.warn(`Potential command conflict in command name "${command.options.name}", group "${command.options.group}".`);
            }
        }
        this.commands.set(COMMAND_INCREMENT, command);
        COMMAND_INCREMENT += 1;
    }
    async loadCommandsIn(path) {
        let fileStats;
        try {
            fileStats = fs_1.statSync(path);
        }
        catch (err) {
            throw Error(err);
        }
        let totalCommands = 0;
        if (fileStats.isDirectory()) {
            await Promise.all(fs_1.readdirSync(path)
                .filter((v) => v.split(".").pop() === "js" ||
                v.split(".").pop() === "ts")
                .map(async (v) => (totalCommands += await this.loadCommandsIn(`${path}/${v}`))));
            await Promise.all(fs_1.readdirSync(path)
                .filter((v) => v.split(".").pop() === v)
                .map(async (v) => (totalCommands += await this.loadCommandsIn(`${path}/${v}`))));
        }
        const toLoad = await Promise.resolve().then(() => __importStar(require(path))).catch((err) => Error(err));
        totalCommands += Object.keys(toLoad).length;
        this.client.logger.debug(`Found ${totalCommands} command(s) in ${chalk_1.default.green(`"${path}"`)}`);
        Object.keys(toLoad).map((v) => this.addCommand(toLoad[v]));
        return totalCommands;
    }
    async execute(m, a) {
        let max = -1;
        let key;
        this.commands
            .filter((v) => 
        // If there is a group
        v.options.group
            ? // If iteration command group matches args
                JSON.stringify(v.options.group) ===
                    JSON.stringify(a.slice(0, v.options.group.length))
                    ? // If command name equals the first arg not part of the command group, or an alias exists for the command name
                        v.options.name === a[v.options.group.length] ||
                            v.hasAlias(a[v.options.group.length])
                    : // No match for name
                        false
            : // Else check if name is same or alias exists
                v.options.name === a[0] || v.hasAlias(a[0]))
            .forEach((c, k) => {
            if ((c.options.group ? c.options.group.length : 0) > max) {
                max = c.options.group ? c.options.group.length : 0;
                key = k;
            }
        });
        if (util_1.isUndefined(key)) {
            return;
        }
        const cmd = this.commands.get(key);
        if (!cmd) {
            return;
        }
        const args = a.slice(cmd.options.group ? cmd.options.group.length + 1 : 1);
        try {
            await verifyPermission(this.client, m, cmd);
        }
        catch (err) {
            if (err instanceof PermissionError_1.PermissionError) {
                if (this.client.options.permissionErrorHandler) {
                    return this.client.options.permissionErrorHandler(m, err);
                }
                else {
                    return m.reply(`:x: You don't have permission to run this command!`);
                }
            }
            else {
                this.client.logger.error(err);
                console.error(err);
            }
        }
        cmd.execute(this.client, m, args);
    }
}
exports.CommandRegistry = CommandRegistry;
