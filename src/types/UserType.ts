import { Message } from "discord.js";

import { SparklClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

export class UserType extends BaseType {
	public options: BaseTypeOptions;
	constructor(opts: BaseTypeOptions) {
		super(opts);
		this.options = {
			argName: opts.argName,
			required: opts.required || false,
			rest: opts.rest,
			typeName: "user",
		};
	}
	public match(client: SparklClient, message: Message, arg: IBaseTypeArg) {
		let snowflake = "";
		let tag = "";

		if (arg.value.startsWith("<")) {
			snowflake = arg.value.replace(/[<@#!&>]/g, "");
		} else if (!isNaN(parseInt(arg.value, 10))) {
			snowflake = arg.value;
		}
		if (arg.value.match(/.*#[0-9]{4}/)) {
			tag = arg.value;
		}

		if (snowflake === "" && tag === "") {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not parse \`${arg.value}\` to type \`${
					this.string
				}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		}

		const user = client.users.find(
			(v) => v.id === snowflake || v.tag === tag,
		);
		if (!user) {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not find user \`${arg.value}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		} else {
			return user;
		}
	}
}
