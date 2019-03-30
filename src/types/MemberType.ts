import { Message } from "discord.js";

import { TailClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

export class MemberType extends BaseType {
	public options: BaseTypeOptions;
	constructor(opts: BaseTypeOptions) {
		super(opts);
		this.options = {
			argName: opts.argName,
			required: opts.required || false,
			rest: opts.rest,
			typeName: "member",
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

		const member = message.guild.members.find((v) => v.user.tag === tag);
		if (!member && !message.guild.members.get(snowflake)) {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not find user \`${arg.value}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		} else if (member) {
			return member;
		} else if (message.guild.members.get(snowflake)) {
			return message.guild.members.get(snowflake);
		}
	}
}
