import { Message } from "discord.js";

import { SparklClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

export class RoleType extends BaseType {
	public options: BaseTypeOptions;
	constructor(opts: BaseTypeOptions) {
		super(opts);
		this.options = {
			argName: opts.argName,
			required: opts.required || false,
			rest: opts.rest,
			typeName: "role",
		};
	}
	public match(client: SparklClient, message: Message, arg: IBaseTypeArg) {
		let snowflake = "";
		let name = "";

		if (arg.value.startsWith("<")) {
			snowflake = arg.value.replace(/[<@#!&>]/g, "");
		} else if (!isNaN(parseInt(arg.value, 10))) {
			snowflake = arg.value;
		} else {
			name = arg.value;
		}

		if (snowflake === "" && name === "") {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not parse \`${arg.value}\` to type \`${
					this.string
				}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		}

		const roleSnowflake = message.guild.roles.get(snowflake);
		const roleName = message.guild.roles.find((v) => v.name === name);

		if (roleSnowflake) {
			return roleSnowflake;
		}
		if (roleName) {
			return roleName;
		}

		throw new SyntaxParseError({
			expectedArgument: this,
			message: `could not find role \`${arg.value}\``,
			recievedArgument: arg,
			type: "PARSE_FAILED",
		});
	}
}
