import { Message } from "discord.js";

import { SparklClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType } from "../types/BaseType";
import { ChannelType } from "../types/ChannelType";
import { DurationType } from "../types/DurationType";
import { MemberType } from "../types/MemberType";
import { NumberType } from "../types/NumberType";
import { RoleType } from "../types/RoleType";
import { StringType } from "../types/StringType";
import { SyntaxString, VALID_SYNTAX_STRINGS } from "../types/SyntaxDefinitions";
import { UnionType } from "../types/UnionType";
import { UserType } from "../types/UserType";

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

function generateTypes(
	typeName: SyntaxString,
	argName: string,
	required?: boolean,
	rest?: boolean,
): BaseType {
	if (VALID_SYNTAX_STRINGS.indexOf(typeName) === -1) {
		throw Error(`Unknown type: ${typeName}`);
	}
	switch (typeName) {
		case "number":
			return new NumberType({
				argName,
				required,
				rest,
			});

		case "string": {
			return new StringType({
				argName,
				required,
				rest,
			});
		}
		case "user": {
			return new UserType({
				argName,
				required,
				rest,
			});
		}
		case "member": {
			return new MemberType({
				argName,
				required,
				rest,
			});
		}
		case "channel": {
			return new ChannelType({
				argName,
				required,
				rest,
			});
		}
		case "role": {
			return new RoleType({
				argName,
				required,
				rest,
			});
		}
		case "duration": {
			return new DurationType({
				argName,
				required,
				rest,
			});
		}
	}
}

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

				const type = (rest
					? arg.split(":")[1].slice(0, -4)
					: arg.split(":")[1].slice(0, -1)) as SyntaxString;

				const union =
					arg.split("|").length > 1
						? arg
								.split("|")
								.map((v) =>
									v.split(":").length > 1
										? v.split(":")[1]
										: v.endsWith(">")
										? v.slice(0, v.length - 1)
										: v.endsWith("...>")
										? v.slice(0, v.length - 4)
										: v,
								)
						: undefined;

				if (union) {
					console.log(
						new UnionType({
							argName,
							required,
							rest,
							types: union.map((v) =>
								generateTypes(v as SyntaxString, argName),
							),
						}),
					);
					return this.syntax.push(
						new UnionType({
							argName,
							required,
							rest,
							types: union.map((v) =>
								generateTypes(v as SyntaxString, argName),
							),
						}),
					);
				}

				// split at name:type

				return this.syntax.push(
					generateTypes(type, argName, required, rest),
				);
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
