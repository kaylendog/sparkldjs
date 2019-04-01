import { Message } from "discord.js";

import { TailClient } from "../client/Client";
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
	public match(client: TailClient, message: Message, arg: IBaseTypeArg) {
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

		const user = client.discord.users.find((v) => v.tag === tag);
		if (!user && !client.discord.users.get(snowflake)) {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not find user \`${arg.value}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		} else if (user) {
			return user;
		} else if (client.discord.users.get(snowflake)) {
			return client.discord.users.get(snowflake);
		}
	}
}
