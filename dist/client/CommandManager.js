"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const PermissionError_1 = require("../errors/PermissionError");
const verifyPermission = async (c, m, cmd) => {
    const config = await c.config.fetchGuildConfig(m.guild);
    let permlevel = cmd.options.permissionLevel;
    let highestPermission = 0;
    if (config.permissions.commandPermissionOverrides &&
        Object.keys(config.permissions.commandPermissionOverrides).indexOf(cmd.options.name) !== -1) {
        permlevel =
            config.permissions.commandPermissionOverrides[cmd.options.name];
    }
    highestPermission =
        config.permissions.users &&
            Object.keys(config.permissions.users).indexOf(m.author.id) !== -1 &&
            config.permissions.users[m.author.id] > highestPermission
            ? config.permissions.users[m.author.id]
            : highestPermission;
    if (config.permissions.roles) {
        Object.keys(config.permissions.roles).map((v) => {
            const rolePerm = config.permissions.roles[v];
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
class CommandManager {
    constructor(client) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
        this.client.discord.on("message", async (m) => {
            if (!m.guild) {
                return;
            }
            const prefix = await this.client.config.fetchGuildConfig(m.guild)
                .prefix;
            if (m.cleanContent.startsWith(prefix)) {
                const args = m.content
                    .slice(prefix.length)
                    .trim()
                    .split(/ +/g);
                if (args) {
                    this.execute(m, args);
                }
            }
        });
    }
    addCommand(command) {
        this.commands.set(COMMAND_INCREMENT, command);
        COMMAND_INCREMENT += 1;
    }
    execute(m, a) {
        let max = -1;
        let key;
        this.commands
            .filter((v, k) => v.options.group
            ? JSON.stringify(v.options.group) ===
                JSON.stringify(a.slice(0, v.options.group.length))
                ? v.options.name === a[v.options.group.length] ||
                    v.hasAlias(a[v.options.group.length])
                : false
            : v.options.name === a[0] || v.hasAlias(a[0]))
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
            verifyPermission(this.client, m, cmd);
        }
        catch (err) {
            if (err instanceof PermissionError_1.PermissionError) {
                return m.channel.send(":negative_squared_cross_mark: Oops! Looks like you don't have the required permission to run this command.");
            }
            else {
                console.error(err);
                return m.channel.send(":negative_squared_cross_mark: Internal Error. Please contact the developer.");
            }
        }
        cmd.execute(this.client, m, args);
    }
}
exports.CommandManager = CommandManager;
