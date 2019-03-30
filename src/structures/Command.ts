import { Message } from "discord.js";

import { TailClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType } from "../types/BaseType";
import { SyntaxParser } from "./SyntaxParser";

export type CommandExecutable<S extends []> = (m: Message, a: S) => any;

interface CommandOptions<S extends []> {
	name: string;
	syntax: string | string[] | BaseType[];
	executable: CommandExecutable<S>;

	guild?: string;
	group?: string[];
	syntaxParser?: SyntaxParser;
}
export class Command<S extends []> {
	public client: TailClient;
	public options: CommandOptions<S>;

	private parser: SyntaxParser;
	constructor(client: TailClient, options: CommandOptions<S>) {
		this.client = client;
		this.options = options;

		this.parser =
			options.syntaxParser ||
			new SyntaxParser({ args: this.options.syntax });
	}

	public async execute(m: Message, a: string[]) {
		if (this.options.guild) {
			if (m.guild) {
				if (m.guild.id !== this.options.guild) {
					return;
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
			const parsedArguments = this.parser.parse(this.client, m, a) as S;

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
			await this.options.executable(m, parsedArguments);

			this.client.logger.debug(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] End EXECUTE at ${new Date()}`,
			);
		} catch (err) {
			if (err instanceof SyntaxParseError) {
				m.channel.send(err.message).catch((errx) => {
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

/*
function syntaxMatch<S extends BaseType[], T extends keyof S>(s: any[]): s is S {
	return s.map((v, i) => ().indexOf(false) === -1 ? true : false;
}
*/
