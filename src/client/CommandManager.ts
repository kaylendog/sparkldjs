import { Client, Collection, Message } from "discord.js";

import { Command } from "../structures/Command";
import { TailClient } from "./Client";

export class CommandManager {
	public client: TailClient;

	private commands: Collection<string, any>;
	private guildStore: Collection<string, string>;
	constructor(client: TailClient, djs: Client) {
		this.client = client;

		this.commands = new Collection();
		this.guildStore = new Collection();

		djs.on("message", (m: Message) => {
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

	public addCommand(command: any) {
		this.commands.set(command, command);
	}

	private execute(m: Message, a: string[]) {
		let max = -1;
		let key: string;
		this.commands
			.filter((v, k) =>
				v.group
					? JSON.stringify(v.group) ===
					  JSON.stringify(a.slice(0, v.group.length))
						? v.name === a[v.group.length] ||
						  v.hasAlias(a[v.group.length])
						: false
					: v.name === a[0] || v.hasAlias(a[0]),
			)
			.forEach((a, k) => {
				if ((a.group ? a.group.length : 0) > max) {
					max = a.group ? a.group.length : 0;
					key = k;
				}
			});

		const cmd = this.commands.get(key);

		if (!cmd) {
			return;
		}
		const args = a.slice(cmd.group ? cmd.group.length + 1 : 1);

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

		if (cmd instanceof Array) {
			const gcmd: Command | Command[] = cmd.find((v) => v.options.name);
			if (gcmd) {
				if (gcmd instanceof Array) {
					throw Error("Command overlap detected.");
				} else {
					gcmd.execute(m, args);
				}
			} else {
				cmd[0].execute(m, args);
			}
		} else {
			cmd.execute(m, args);
		}
	}
}
