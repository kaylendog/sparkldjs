"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let COMMAND_INCREMENT = 0;
class CommandManager {
    constructor(client, djs) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
        this.guildStore = new discord_js_1.Collection();
        djs.on("message", (m) => {
            const mGuild = m.guild;
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
            .filter((v, k) => v.group
            ? JSON.stringify(v.group) ===
                JSON.stringify(a.slice(0, v.group.length))
                ? v.name === a[v.group.length] ||
                    v.hasAlias(a[v.group.length])
                : false
            : v.name === a[0] || v.hasAlias(a[0]))
            .forEach((c, k) => {
            if ((c.options.group ? c.options.group.length : 0) > max) {
                max = c.options.group ? c.options.group.length : 0;
                key = k;
            }
        });
        if (!key) {
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
        cmd.execute(m, args);
    }
}
exports.CommandManager = CommandManager;
