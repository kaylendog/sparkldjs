import { Message } from "discord.js";

import { UserType } from "../../test/UserType";
import { SparklClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType } from "../types/BaseType";
import { ChannelType } from "../types/ChannelType";
import { DurationType } from "../types/DurationType";
import { MemberType } from "../types/MemberType";
import { NumberType } from "../types/NumberType";
import { RoleType } from "../types/RoleType";
import { StringType } from "../types/StringType";

export interface ParserOptions {
	args?: string | string[] | BaseType[];
	errorMessages?: {
		NOT_ENOUGH_ARGS: (index: number, expectedArgument: BaseType) => string;
		TOO_MANY_ARGS: (args: string) => string;
		PARSED_FAILED: (
			expectedArgument: BaseType,
			recievedArgument: any,
		) => string;
	};
}

export const DEFAULT_SYNTAX_ERRORS = {
	NOT_ENOUGH_ARGS: (index: number, arg: BaseType) =>
		`expected arg type \`${arg.string}\` at position \`${index}\``,
	TOO_MANY_ARGS: (args: string) => `expected \`${args || "none"}\``,
};

export class SyntaxParser {
	private options: ParserOptions;
	private syntax: BaseType[];
	constructor(options: ParserOptions) {
		this.options = options;
		if (!this.options.args) {
			this.syntax = [];
		} else if (this.options.args instanceof Array) {
			this.syntax = this.options.args as BaseType[];
		} else {
			// string syntax parser

			// split string at spaces between args
			this.syntax = [];
			this.options.args.split(" ").map((arg) => {
				let required;
				let rest;
				const argName = arg.split(":")[0].slice(1);
				if (arg.slice(0, -1).endsWith("...")) {
					rest = true;
				}
				if (arg.startsWith("<")) {
					// if < is present, arg is not optional
					required = true;
				}

				const type = rest
					? arg.split(":")[1].slice(0, -4)
					: arg.split(":")[1].slice(0, -1);

				// split at name:type

				switch (type) {
					case "number":
						this.syntax.push(
							new NumberType({
								argName,
								required,
								rest,
							}),
						);
						break;
					case "string": {
						this.syntax.push(
							new StringType({
								argName,
								required,
								rest,
							}),
						);
						break;
					}
					case "user": {
						this.syntax.push(
							new UserType({
								argName,
								required,
								rest,
							}),
						);
						break;
					}
					case "member": {
						this.syntax.push(
							new MemberType({
								argName,
								required,
								rest,
							}),
						);
						break;
					}
					case "channel": {
						this.syntax.push(
							new ChannelType({
								argName,
								required,
								rest,
							}),
						);
						break;
					}
					case "role": {
						this.syntax.push(
							new RoleType({
								argName,
								required,
								rest,
							}),
						);
					}
					case "duration": {
						this.syntax.push(
							new DurationType({
								argName,
								required,
								rest,
							}),
						);
					}
				}
			});
		}
	}

	public parse(client: SparklClient, message: Message, args?: string[]) {
		const parsedArgs: any[] = [];
		if (!args) {
			return [];
		}
		args.map((arg, i) => {
			// if argument does not exist, and there are no rest args, throw error.
			if (
				!this.syntax[i] &&
				!this.syntax.find((v) => v.options.rest === true)
			) {
				return;
				/*
				throw new SyntaxParseError({
					message: this.options.errorMessages
						? this.options.errorMessages.TOO_MANY_ARGS(
								this.syntax.map((v) => v.string).join(" "),
						  )
						: DEFAULT_SYNTAX_ERRORS.TOO_MANY_ARGS(
								this.syntax.map((v) => v.string).join(" "),
						  ),
					recievedArgument: {
						index: i,
						value: arg,
					},
					type: "TOO_MANY_ARGS",
				});
				*/
			} else if (!this.syntax[i]) {
				return (parsedArgs[this.syntax.length - 1] = parsedArgs[
					this.syntax.length - 1
				].concat(
					" ",
					this.syntax[this.syntax.length - 1].match(client, message, {
						index: this.syntax.length - 1,
						value: arg,
					}),
				));
			} else if (
				this.syntax[i].options.required &&
				this.syntax[i - 1] &&
				!this.syntax[i - 1].options.required
			) {
				client.logger.error(
					"A required arg has appeared after an unrequired arg.",
				);
				throw Error(`Internal error. Please contact the developer.`);
			}

			let preHasRequired = { failed: false, index: 0, string: "" };
			this.syntax.map((s, ix) => {
				if (s.options.required && !args[ix] && !preHasRequired.failed) {
					preHasRequired = {
						failed: true,
						index: ix,
						string: s.string,
					};
				}
			});
			if (preHasRequired.failed) {
				throw new SyntaxParseError({
					expectedArgument: this.syntax[preHasRequired.index],
					message: this.options.errorMessages
						? this.options.errorMessages.NOT_ENOUGH_ARGS(
								preHasRequired.index,
								this.syntax[preHasRequired.index],
						  )
						: DEFAULT_SYNTAX_ERRORS.NOT_ENOUGH_ARGS(
								preHasRequired.index,
								this.syntax[preHasRequired.index],
						  ),
					recievedArgument: {
						index: i,
						value: arg,
					},
					type: "NOT_ENOUGH_ARGS",
				});
			} else {
				return parsedArgs.push(
					this.syntax[i].match(client, message, {
						index: i,
						value: arg,
					}),
				);
			}
		});

		let hasRequired = { failed: false, index: 0, string: "" };
		this.syntax.map((s, ix) => {
			if (s.options.required && !args[ix] && !hasRequired.failed) {
				hasRequired = {
					failed: true,
					index: ix,
					string: s.string,
				};
			}
		});
		if (hasRequired.failed) {
			throw new SyntaxParseError({
				expectedArgument: this.syntax[hasRequired.index],
				message: this.options.errorMessages
					? this.options.errorMessages.NOT_ENOUGH_ARGS(
							hasRequired.index,
							this.syntax[hasRequired.index],
					  )
					: DEFAULT_SYNTAX_ERRORS.NOT_ENOUGH_ARGS(
							hasRequired.index,
							this.syntax[hasRequired.index],
					  ),
				type: "NOT_ENOUGH_ARGS",
			});
		}
		return parsedArgs;
	}
}
