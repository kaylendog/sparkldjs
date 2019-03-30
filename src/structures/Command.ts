import { Guild, Message, RoleResolvable } from "discord.js";

import { TailClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType } from "../types/BaseType";
import { EMOTES } from "../util/Constants";
import { ParserOptions, SyntaxParser } from "./SyntaxParser";

interface CommandOptions {
	aliases?: string[];
	errorMessages?: CommandErrors;
	name: string;
	guildId?: string | string[];
	permLevel: number | RoleResolvable[];
	syntax?: BaseType[] | string | string[];
	parser?: SyntaxParser;
	group?: string[];
}

export type CommandExecutable<A extends []> = (
	client: TailClient,
	message: Message,
	args: A,
) => any;

interface CommandErrors {
	NOT_FOUND: () => string;
	NO_PERMISSION: () => string;
	GUILD_SPECIFIC: () => string;
}

const DEFAULT_COMMAND_ERRORS: CommandErrors = {
	GUILD_SPECIFIC: () => "This command isn't enabled in this server!",
	NOT_FOUND: () => "Oops! That command wasn't found.",
	NO_PERMISSION: () => "Oops! You don't have permission to run this command!",
};

export class Command<A extends []> {
	public client: TailClient;
	public options: CommandOptions;

	private executable: CommandExecutable<A>;
	private discordGuild?: Guild | Guild[];
	private syntaxParser: SyntaxParser;
	constructor(
		client: TailClient,
		options: CommandOptions,
		executeable: CommandExecutable<A>,
	) {
		this.client = client;
		this.options = options;
		this.executable = executeable;

		this.syntaxParser = options.parser
			? options.parser
			: new SyntaxParser({
					args: this.options.syntax,
			  });
	}

	public async execute(message: Message, args: string[]) {
		if (this.options.guildId) {
			if (message.guild) {
				if (message.guild.id !== this.options.guildId) {
					return message.reply(
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
				message,
				args,
			);

			this.client.emit("command", {
				command: this.options.group
					? `${this.options.group} ${this.options.name}`
					: this.options.name,
				message,
				timestamp: new Date(),
			});
			this.client.logger.log(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] ID: ${message.author.id} - ${Date.now() - beginExecute}ms`,
			);
			await this.executable(this.client, message, parsedArguments);

			this.client.logger.debug(
				`[cmd] [${
					this.options.group
						? `${this.options.group} ${this.options.name}`
						: this.options.name
				}] End EXECUTE at ${new Date()}`,
			);
		} catch (err) {
			if (err instanceof SyntaxParseError) {
				message.channel.send(err.message).catch((errx) => {
					this.client.logger.error(err);
					this.client.logger.error(errx);
				});
			} else {
				message.reply(
					":negative_squared_cross_mark: Internal error. Please contact the developer.",
				);
				this.client.logger.error(err);
				console.error(err);
			}
		}
	}

	public injectGuild(guild: Guild) {
		this.discordGuild = guild;
	}

	get name() {
		return this.options.name;
	}

	get guild() {
		return this.discordGuild;
	}

	get guildId() {
		return this.options.guildId;
	}

	get permission() {
		return this.options.permLevel;
	}
	get group() {
		return this.options.group;
	}

	public hasAlias(name: string) {
		if (this.options.aliases && this.options.aliases.indexOf(name) !== -1) {
			return true;
		} else {
			return false;
		}
	}

	public parser(opts: string | string[] | ParserOptions) {
		if (typeof opts === "object" && !(opts instanceof Array)) {
			this.syntaxParser = new SyntaxParser(opts);
		} else {
			this.syntaxParser = new SyntaxParser({
				args: opts,
			});
		}
		return this;
	}
}
