import { Message } from "discord.js";

import { TailClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType } from "../types/BaseType";
import { SyntaxParsable } from "../types/SyntaxDefinitions";
import { SyntaxParser } from "./SyntaxParser";

export type CommandExecutable<S extends SyntaxParsable[]> = (
	c: TailClient,
	m: Message,
	a: S,
) => any;

interface CommandOptions<S extends SyntaxParsable[]> {
	name: string;
	syntax: string | string[] | BaseType[];
	executable: CommandExecutable<S>;

	aliases?: string[];
	guild?: string;
	group?: string[];
	syntaxParser?: SyntaxParser;
}
export class Command<S extends SyntaxParsable[]> {
	public options: CommandOptions<S>;

	private parser: SyntaxParser;
	constructor(options: CommandOptions<S>) {
		this.options = options;

		this.parser =
			options.syntaxParser ||
			new SyntaxParser({ args: this.options.syntax });
	}

	public async execute(c: TailClient, m: Message, a: string[]) {
		if (this.options.guild) {
			if (m.guild) {
				if (m.guild.id !== this.options.guild) {
					return;
				}
			} else {
				return;
			}
		}
		if (!m.guild) {
			return;
		}

		const beginExecute = Date.now();
		c.logger.debug(
			`[cmd] [${
				this.options.group
					? `${this.options.group} ${this.options.name}`
					: this.options.name
			}] Begin EXECUTE at ${new Date()}`,
		);

		try {
			const parsedArguments = this.parser.parse(c, m, a) as S;

			c.emit("command", {
				command: this.options.group
					? `${this.options.group} ${this.options.name}`
					: this.options.name,
				m,
				timestamp: new Date(),
			});
			c.logger.log(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] ID: ${m.author.id} - ${Date.now() - beginExecute}ms`,
			);
			await this.options.executable(c, m, parsedArguments);

			c.logger.debug(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] End EXECUTE at ${new Date()}`,
			);
		} catch (err) {
			if (err instanceof SyntaxParseError) {
				if (c.options.syntaxErrorHandler) {
					return c.options.syntaxErrorHandler(m, err);
				}
				m.channel.send(err.message).catch((errx) => {
					c.logger.error(err);
					c.logger.error(errx);
				});
			} else {
				m.reply(
					":negative_squared_cross_mark: Internal error. Please contact the developer.",
				);
				c.logger.error(err);
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

/*
function syntaxMatch<S extends BaseType[], T extends keyof S>(s: any[]): s is S {
	return s.map((v, i) => ().indexOf(false) === -1 ? true : false;
}
*/
