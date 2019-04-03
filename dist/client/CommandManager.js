"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = require("util");
let COMMAND_INCREMENT = 0;
class CommandManager {
    constructor(client) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
        this.guildStore = new discord_js_1.Collection();
        client.discord.on("message", (m) => {
            if (!m.guild) {
                return;
            }
            let prefix = this.guildStore.get(m.guild.id);
            if (!prefix) {
                prefix = "!";
            }
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
        /*
        try {
            verifyPermission(
                this.client,
                m,
                cmd.permission,
                await(this.client.options.storageStrategy as Strategy).getGuild(
                    this.client,
                    m.guild.id,
                ),
            );
        } catch (err) {
            if (err instanceof PermissionError) {
                return m.channel.send(
                    `:negative_squared_cross_mark: ${
                        this.client.options.commands
                            ? this.client.options.commands.permissionErrors
                                ? this.client.options.commands.permissionErrors.default(
                                        err,
                                  )
                                : "Oops! Looks like you don't have the required permission to run this command."
                            : "Oops! Looks like you don't have the required permission to run this command."
                    }`,
                );
            } else {
                console.error(err);
                return m.channel.send(
                    ":negative_squared_cross_mark: Internal Error. Please contact the developer.",
                );
            }
        }
        */
        cmd.execute(this.client, m, args);
    }
}
exports.CommandManager = CommandManager;
