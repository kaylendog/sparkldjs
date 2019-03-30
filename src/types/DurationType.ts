import { Message } from "discord.js";

import { TailClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

export class DurationType extends BaseType {
	public options: BaseTypeOptions;
	constructor(typeOptions: BaseTypeOptions) {
		super(typeOptions);
		this.options = {
			argName: typeOptions.argName,
			required: typeOptions.required || false,
			rest: typeOptions.rest,
			typeName: "duration",
		};
	}
	public match(client: TailClient, message: Message, arg: IBaseTypeArg) {
		let multiplier: number;

		const unit = arg.value.slice(-1);
		const value = parseInt(arg.value.slice(0, arg.value.length - 1), 10);

		if (isNaN(value)) {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not parse \`${arg.value}\` to type \`${
					this.string
				}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		}

		switch (unit) {
			case "s": {
				multiplier = 1;
				break;
			}
			case "m": {
				multiplier = 60;
				break;
			}
			case "h": {
				multiplier = 60 * 60;
				break;
			}
			case "d": {
				multiplier = 60 * 60 * 24;
				break;
			}
			case "w": {
				multiplier = 60 * 60 * 24 * 7;
				break;
			}
			case "y": {
				multiplier = 60 * 60 * 24 * 7 * 365;
				break;
			}
			default: {
				throw new SyntaxParseError({
					expectedArgument: this,
					message: `could not parse \`${arg.value}\` to type \`${
						this.string
					}\``,
					recievedArgument: arg,
					type: "PARSE_FAILED",
				});
			}
		}

		return value * multiplier * 1000;
	}
}
