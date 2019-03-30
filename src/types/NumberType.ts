import { Message } from "discord.js";

import { TailClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

export interface INumberTypeOptions extends BaseTypeOptions {
	maxValue?: number;
	minValue?: number;
}
export class NumberType extends BaseType {
	public options: INumberTypeOptions;
	constructor(typeOptions: INumberTypeOptions) {
		super(typeOptions);
		this.options = {
			argName: typeOptions.argName,
			required: typeOptions.required || false,
			rest: typeOptions.rest,
			typeName: "number",
		};

		this.options.maxValue = typeOptions.maxValue;
		this.options.minValue = typeOptions.minValue;
	}
	public match(client: TailClient, message: Message, arg: IBaseTypeArg) {
		const int = parseInt(arg.value, 10);
		if (isNaN(int)) {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not parse \`${arg.value}\` to type \`${
					this.string
				}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		}
		if (this.options.maxValue) {
			if (int > this.options.maxValue) {
				throw new SyntaxParseError({
					expectedArgument: this,
					message: `number \`${arg.value}\` is out of range \`${
						arg.value
					}\` to type \`${this.string}\``,
					recievedArgument: arg,
					type: "PARSE_FAILED",
				});
			}
		}
		if (this.options.minValue) {
			if (int < this.options.minValue) {
				throw new SyntaxParseError({
					expectedArgument: this,
					message: `number \`${arg.value}\` is out of range \`${
						arg.value
					}\` to type \`${this.string}\``,
					recievedArgument: arg,
					type: "PARSE_FAILED",
				});
			}
		}
		return int;
	}
}
