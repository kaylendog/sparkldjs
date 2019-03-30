import { Message } from "discord.js";

import { TailClient } from "../client/Client";

export class Command {
	public client: TailClient;
	constructor(client: TailClient) {
		this.client = client;
	}

	public execute(m: Message, arg: string[]) {
		if (this.options.guildId) {
			if (m.guild) {
				if (m.guild.id === this.options.guildId) {
				} else {
					return m.reply(
						`${EMOTES.NO}${
							this.options.errorMessages
								? this.options.errorMessages.GUILD_SPECIFIC()
								: DEFAULT_COMMAND_ERRORS.GUILD_SPECIFIC()
						}`,
					);
				}
			}
		}

		const beginExecute = Date.now();
		this.client.logger.debug(
			`[cmd] [${
				this.options.group
					? `${this.options.group} ${this.options.name}`
					: this.options.name
			}] Begin EXECUTE at ${new Date()}`,
		);

		try {
			const parsedArguments = this.syntaxParser.parse(
				this.client,
				m,
				args,
			);

			this.client.emit("command", {
				command: this.options.group
					? `${this.options.group} ${this.options.name}`
					: this.options.name,
				m,
				timestamp: new Date(),
			});
			this.client.logger.log(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] ID: ${m.author.id} - ${Date.now() - beginExecute}ms`,
			);
			await this.executable(this.client, m, parsedArguments);

			this.client.logger.debug(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] End EXECUTE at ${new Date()}`,
			);
		} catch (err) {
			if (err instanceof SyntaxParseError) {
				m.channel.send(err.m).catch((errx) => {
					this.client.logger.error(err);
					this.client.logger.error(errx);
				});
			} else {
				m.reply(
					":negative_squared_cross_mark: Internal error. Please contact the developer.",
				);
				this.client.logger.error(err);
				console.error(err);
			}
		}
	}
}
