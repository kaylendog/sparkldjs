import { Message } from "discord.js";

import { SparklClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType } from "../types/BaseType";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { SyntaxParser } from "./SyntaxParser";

export type CommandExecutable<S extends SyntaxParsable[]> = (
	c: SparklClient,
	m: Message,
	a: S,
) => any;

interface CommandOptions<S extends SyntaxParsable[]> {
	name: string;
	syntax: string | string[] | BaseType[];
	executable: CommandExecutable<S>;
	permissionLevel: number;

	aliases?: string[];
	guild?: string | string[];
	group?: string[];
	syntaxParser?: SyntaxParser;
	plugin?: string;
}

/**
 * Class enabling users to directly interact with the client from Discord
 */
export class Command<S extends SyntaxParsable[]> {
	public options: CommandOptions<S>;

	private parser: SyntaxParser;
	constructor(options: CommandOptions<S>) {
		this.options = options;

		this.parser =
			options.syntaxParser ||
			new SyntaxParser({ args: this.options.syntax });
	}

	/**
	 *
	 * @param {SparklClient} client The client object
	 * @param {Message} message The message triggering the command
	 * @param {string[]} args Arguments parsed to the command
	 */
	public async execute(
		client: SparklClient,
		message: Message,
		args: string[],
	) {
		if (this.options.guild) {
			if (message.guild) {
				if (message.guild.id !== this.options.guild) {
					return;
				}
			} else {
				return;
			}
		}
		if (!message.guild) {
			return;
		}

		const beginExecute = Date.now();
		client.logger.debug(
			`[cmd] [${
				this.options.group
					? `${this.options.group} ${this.options.name}`
					: this.options.name
			}] Begin EXECUTE at ${new Date()}`,
		);

		try {
			const parsedArguments = this.parser.parse(
				client,
				message,
				args,
			) as S;

			client.emit("command", {
				command: this.options.group
					? `${this.options.group} ${this.options.name}`
					: this.options.name,
				message,
				timestamp: new Date(),
			});
			client.logger.info(
				`[cmd] [${
					this.options.group
						? `${this.options.group.join(".")}.${this.options.name}`
						: this.options.name
				}] ID: ${message.author.id} - ${Date.now() - beginExecute}ms`,
			);
			await this.options.executable(client, message, parsedArguments);

			client.logger.debug(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] End EXECUTE at ${new Date()}`,
			);
		} catch (err) {
			if (err instanceof SyntaxParseError) {
				if (client.options.syntaxErrorHandler) {
					return client.options.syntaxErrorHandler(message, err);
				}
				message.channel.send(err.message).catch((errx) => {
					client.logger.error(err);
					client.logger.error(errx);
				});
			} else {
				message.reply(
					":negative_squared_cross_mark: Internal error. Please contact the developer.",
				);
				client.logger.error(err);
				console.error(err);
			}
		}
	}

	public hasAlias(s: string) {
		if (this.options.aliases) {
			if (this.options.aliases.indexOf(s) !== -1) {
				return true;
			}
		}
		return false;
	}
}
