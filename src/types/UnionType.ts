import { Message } from "discord.js";

import { TailClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

interface UnionTypeOptions extends BaseTypeOptions {
	types: BaseType[];
}

/**
 * Type for combining types - just a bit of typeception
 */
export class UnionType extends BaseType {
	public options: UnionTypeOptions;
	constructor(opts: UnionTypeOptions) {
		super(opts);
		this.options = {
			argName: opts.argName,
			required: opts.required || false,
			rest: opts.rest,
			typeName: "union",
			types: opts.types,
		};

		if (opts.types.find((v) => v.options.typeName === "union")) {
			throw Error(
				"Found a union type in a union type - that's never a good idea.",
			);
		}
	}
	public match(client: TailClient, message: Message, arg: IBaseTypeArg) {
		const allHaveFailed = false;
		let totalFailed = 0;
		const values: any = [];

		this.options.types.map((v) => {
			try {
				values.push(v.match(client, message, arg));
			} catch (err) {
				if (err instanceof SyntaxParseError) {
					totalFailed += 1;
				} else {
					throw err;
				}
			}
		});

		if (totalFailed === this.options.types.length) {
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
	get string() {
		return `${this.options.required ? "<" : "["}${
			this.options.argName
		}:${this.options.types.map((v) => this.options.typeName).join("|")}${
			this.options.rest ? "..." : ""
		}${this.options.required ? ">" : "]"}`;
	}
}
