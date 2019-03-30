import { Collection, Guild, Message, Role, RoleResolvable } from "discord.js";

import { PermissionError } from "../errors/PermissionError";
import { Command } from "../structures/Command";
import { TailClient } from "./Client";

interface ICommandQuery {
	guild?: string;
	id?: string;
	name?: string;
}

function verifyPermission(
	client: TailClient,
	m: Message,
	n: number | RoleResolvable[],
	guild: IGuild,
) {
	let userPermLevel = 0;
	if (
		client.tailOptions.permissionOverrides &&
		client.tailOptions.permissionOverrides.indexOf(m.author.id) !== -1
	) {
		return;
	}
	guild.rolePermissions.forEach((int, id) => {
		userPermLevel =
			m.member.roles.get(id instanceof Role ? id.id : id) &&
			int > userPermLevel
				? int
				: userPermLevel;
	});
	if (userPermLevel < n) {
		throw new PermissionError({
			message: "Lacking permission",
			recievedPermission: userPermLevel,
			requiredPermission: n,
		});
	} else {
		return;
	}
}

export class CommandManager {
	public commands: Collection<number, Command<any>>;
	public client: TailClient;

	private commandIdIncrement: number;

	constructor(client: TailClient) {
		this.commands = new Collection();
		this.client = client;

		this.commandIdIncrement = 0;

		this.client.on("ready", () => {
			this.client.logger.debug(`[cmd] Setting up command manager...`);

			this.client.on("message", async (message: Message) => {
				const mGuild = message.guild;
				const storageStrategy = this.client.options
					.storageStrategy as Strategy;
				let prefix;
				if (!(await storageStrategy.getGuild(this.client, mGuild.id))) {
					prefix = "!";
				} else {
					prefix = (await storageStrategy.getGuild(
						this.client,
						mGuild.id,
					)).prefix;
				}

				if (message.cleanContent.startsWith(prefix)) {
					const args = message.content
						.slice(prefix.length)
						.trim()
						.split(/ +/g);
					if (args) {
						this.execute(args, message);
					}
				}
			});
			this.client.logger.debug(
				`[cmd] Have registered ${
					this.commands.size
				} commands on startup.`,
			);
		});
	}

	public findCommand(property: never, value: any) {
		return this.commands.find(property, value) || undefined;
	}

	public removeCommand(id: number | ICommandQuery) {
		if (typeof id === "number") {
			return this.commands.delete(id);
		} else {
			if (id.guild && id.name) {
				const commands = this.commands.find(
					(v: Command) => v.guild === id.guild,
				);
				if (commands instanceof Array) {
					const cmd = commands.find(
						(v) => v.options.name === id.name,
					);
					if (cmd) {
						return this.commands.delete(cmd.options.id);
					} else {
						return;
					}
				}
			}
		}
	}

	public async execute(cmdArgs: string[], message: Message) {
		let max = -1;
		let key;
		this.commands
			.filter((v, k) =>
				v.group
					? JSON.stringify(v.group) ===
					  JSON.stringify(cmdArgs.slice(0, v.group.length))
						? v.name === cmdArgs[v.group.length] ||
						  v.hasAlias(cmdArgs[v.group.length])
						: false
					: v.name === cmdArgs[0] || v.hasAlias(cmdArgs[0]),
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
		const args = cmdArgs.slice(cmd.group ? cmd.group.length + 1 : 1);

		try {
			verifyPermission(
				this.client,
				message,
				cmd.permission,
				await (this.client.options
					.storageStrategy as Strategy).getGuild(
					this.client,
					message.guild.id,
				),
			);
		} catch (err) {
			if (err instanceof PermissionError) {
				return message.channel.send(
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
				return message.channel.send(
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
					gcmd.execute(this.client, message, args);
				}
			} else {
				cmd[0].execute(this.client, message, args);
			}
		} else {
			cmd.execute(message, args);
		}
	}

	public addCommand<S extends []>(command: Command<S>) {
		const existingCommand = this.commands.find(
			(v) => v.name === command.name,
		);

		// messy logic for testing if a command has already been added.
		if (existingCommand && command.guildId) {
			// If existing command has an array of guilds
			if (existingCommand.guildId instanceof Array) {
				existingCommand.guildId.map((id) => {
					if (command.guildId instanceof Array) {
						if (command.guildId.indexOf(id) !== -1) {
							this.client.logger.warn(
								`Command ${
									command.name
								} has been duplicated in guild ID ${id}`,
							);
						}
					} else if (command.guildId === id) {
						this.client.logger.warn(
							`Command ${
								command.name
							} has been duplicated in guild ID ${id}`,
						);
					}
				});
				// If it doesn't:
			} else if (command.guildId instanceof Array) {
				if (
					command.guildId.indexOf(
						existingCommand.guildId as string,
					) !== -1
				) {
					this.client.logger.warn(
						`Command ${
							command.name
						} has been duplicated in guild ID ${
							existingCommand.guildId
						}`,
					);
				}
			} else if (command.guildId === existingCommand.guildId) {
				this.client.logger.warn(
					`Command ${command.name} has been duplicated in guild ID ${
						existingCommand.guildId
					}`,
				);
			}
		} else {
			if (
				existingCommand &&
				existingCommand.group === command.group &&
				existingCommand.name === command.name
			) {
				this.client.logger.warn(
					`Potential command conflict in command name "${
						command.name
					}", group "${command.group}".`,
				);
			}
		}
		this.commands.set(this.commandIdIncrement, command);

		if (command.guildId) {
			if (command.guildId instanceof Array) {
				command.guildId.map((id) => {
					const guild = this.client.guilds.get(id);
					return guild
						? (this.commands.get(
								this.commandIdIncrement,
						  ) as Command).injectGuild(guild)
						: null;
				});
			} else {
				const guild = this.client.guilds.get(command.guildId);
				return guild
					? (this.commands.get(
							this.commandIdIncrement,
					  ) as Command).injectGuild(guild)
					: null;
			}

			// When the command's guild updates, update the guild object on the command.
			this.client.on("guildUpdate", (guild: Guild) => {
				if (command.guildId instanceof Array) {
					if (command.guildId.indexOf(guild.id) !== -1) {
						(this.commands.get(
							this.commandIdIncrement,
						) as Command).injectGuild(this.client.guilds.get(
							guild.id,
						) as Guild);
					}
				} else {
					if (guild.id === command.guildId) {
						(this.commands.get(
							this.commandIdIncrement,
						) as Command).injectGuild(this.client.guilds.get(
							guild.id,
						) as Guild);
					}
				}
			});
		}

		this.commandIdIncrement += 1;
	}
}
