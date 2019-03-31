import { Client, Collection, Message } from "discord.js";

// import { PermissionError } from "../errors/PermissionError";
import { Command } from "../structures/Command";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { TailClient } from "./Client";

let COMMAND_INCREMENT = 0;
export class CommandManager {
	public client: TailClient;

	private commands: Collection<number, any>;
	private guildStore: Collection<string, string>;
	constructor(client: TailClient) {
		this.client = client;

		this.commands = new Collection();
		this.guildStore = new Collection();

		client.discord.on("message", (m: Message) => {
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

	public addCommand<S extends SyntaxParsable[]>(command: Command<S>) {
		this.commands.set(COMMAND_INCREMENT, command);
		COMMAND_INCREMENT += 1;
	}

	private execute(m: Message, a: string[]) {
		let max = -1;
		let key: number | undefined;
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
			.forEach((c: Command<any>, k) => {
				if ((c.options.group ? c.options.group.length : 0) > max) {
					max = c.options.group ? c.options.group.length : 0;
					key = k;
				}
			});

		if (!key) {
			return;
		}

		const cmd: Command<any> | undefined = this.commands.get(key);

		if (!cmd) {
			return;
		}
		const args = a.slice(
			cmd.options.group ? cmd.options.group.length + 1 : 1,
		);

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
