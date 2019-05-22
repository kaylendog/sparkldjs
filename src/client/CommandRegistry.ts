import chalk from "chalk";
import { Collection, Message } from "discord.js";
import { PathLike, readdirSync, stat, statSync } from "fs";
import { isUndefined } from "util";

import { PermissionError } from "../errors/PermissionError";
import { Command } from "../structures/Command";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { SparklClient } from "./Client";

const verifyPermission = async (
	c: SparklClient,
	m: Message,
	cmd: Command<any>,
) => {
	return true;
	/*
	const config = await c.config.fetchGuildConfig(m.guild);
	let permlevel = cmd.options.permissionLevel;
	let highestPermission = 0;

	if (
		config.permissions.commandPermissionOverrides &&
		Object.keys(config.permissions.commandPermissionOverrides).indexOf(
			cmd.options.name,
		) !== -1
	) {
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
			const rolePerm = (config.permissions.roles as {
				[x: string]: number;
			})[v];
			if (m.member.roles.get(v) && rolePerm) {
				highestPermission =
					rolePerm > highestPermission ? rolePerm : highestPermission;
			}
		});
	}

	if (highestPermission >= permlevel) {
		return true;
	} else {
		throw new PermissionError({
			message: "NOT_ENOUGH_PERMISSION",
			receivedPermission: highestPermission,
			requiredPermission: permlevel,
		});
	}
	*/
};

let COMMAND_INCREMENT = 0;
export class CommandRegistry {
	public client: SparklClient;
	public commands: Collection<number, Command<any>>;

	constructor(client: SparklClient) {
		this.client = client;

		this.commands = new Collection();

		this.client.on("message", async (m: Message) => {
			if (!m.guild) {
				return;
			}
			const prefix = "!";

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

	public addCommand<S extends SyntaxParsable[]>(command: Command<S>) {
		const existingCommand = this.commands.find(
			(v) => v.options.name === command.options.name,
		);

		// messy logic for testing if a command has already been added.
		if (existingCommand && command.options.guild) {
			// If existing command has an array of guilds
			if (existingCommand.options.guild instanceof Array) {
				existingCommand.options.guild.map((id: string) => {
					if (command.options.guild instanceof Array) {
						if (command.options.guild.indexOf(id) !== -1) {
							this.client.logger.warn(
								`Command ${
									command.options.name
								} has been duplicated in guild ID ${id}`,
							);
						}
					} else if (command.options.guild === id) {
						this.client.logger.warn(
							`Command ${
								command.options.name
							} has been duplicated in guild ID ${id}`,
						);
					}
				});
				// If it doesn't:
			} else if (command.options.guild instanceof Array) {
				if (
					command.options.guild.indexOf(existingCommand.options
						.guild as string) !== -1
				) {
					this.client.logger.warn(
						`Command ${
							command.options.name
						} has been duplicated in guild ID ${
							existingCommand.options.guild
						}`,
					);
				}
			} else if (
				command.options.guild === existingCommand.options.guild
			) {
				this.client.logger.warn(
					`Command ${
						command.options.name
					} has been duplicated in guild ID ${
						existingCommand.options.guild
					}`,
				);
			}
		} else {
			if (
				existingCommand &&
				existingCommand.options.group === command.options.group &&
				existingCommand.options.name === command.options.name
			) {
				this.client.logger.warn(
					`Potential command conflict in command name "${
						command.options.name
					}", group "${command.options.group}".`,
				);
			}
		}
		this.commands.set(COMMAND_INCREMENT, command);
		COMMAND_INCREMENT += 1;
	}

	public async loadCommandsIn(path: string) {
		let fileStats;
		try {
			fileStats = statSync(path);
		} catch (err) {
			throw Error(err);
		}

		let totalCommands = 0;

		if (fileStats.isDirectory()) {
			await Promise.all(
				readdirSync(path)
					.filter(
						(v) =>
							v.split(".").pop() === "js" ||
							v.split(".").pop() === "ts",
					)
					.map(
						async (v) =>
							(totalCommands += await this.loadCommandsIn(
								`${path}/${v}`,
							)),
					),
			);

			await Promise.all(
				readdirSync(path)
					.filter((v) => v.split(".").pop() === v)
					.map(
						async (v) =>
							(totalCommands += await this.loadCommandsIn(
								`${path}/${v}`,
							)),
					),
			);
		}

		const toLoad: { [x: string]: Command<any> } = await import(path).catch(
			(err) => Error(err),
		);

		totalCommands += Object.keys(toLoad).length;

		this.client.logger.debug(
			`Found ${totalCommands} command(s) in ${chalk.green(`"${path}"`)}`,
		);
		Object.keys(toLoad).map((v) => this.addCommand(toLoad[v]));
		return totalCommands;
	}

	private async execute(m: Message, a: string[]) {
		let max = -1;
		let key: number | undefined;
		this.commands
			.filter((v: Command<any>) =>
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
					  v.options.name === a[0] || v.hasAlias(a[0]),
			)
			.forEach((c: Command<any>, k) => {
				if ((c.options.group ? c.options.group.length : 0) > max) {
					max = c.options.group ? c.options.group.length : 0;
					key = k;
				}
			});

		if (isUndefined(key)) {
			return;
		}

		const cmd: Command<any> | undefined = this.commands.get(key);

		if (!cmd) {
			return;
		}

		const args = a.slice(
			cmd.options.group ? cmd.options.group.length + 1 : 1,
		);

		try {
			await verifyPermission(this.client, m, cmd);
		} catch (err) {
			if (err instanceof PermissionError) {
				if (this.client.options.permissionErrorHandler) {
					return this.client.options.permissionErrorHandler(m, err);
				} else {
					return m.reply(
						`:x: You don't have permission to run this command!`,
					);
				}
			} else {
				this.client.logger.error(err);
				console.error(err);
			}
		}

		cmd.execute(this.client, m, args);
	}
}
