import { GuildChannel, Message, TextChannel, VoiceChannel } from "discord.js";

import { SparklClient } from "../client/Client";
import { SyntaxParseError } from "../errors/SyntaxParseError";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

export class ChannelType extends BaseType {
	public options: BaseTypeOptions;
	constructor(opts: BaseTypeOptions) {
		super(opts);
		this.options = {
			argName: opts.argName,
			required: opts.required || false,
			rest: opts.rest,
			typeName: "channel",
		};
	}
	public match(client: SparklClient, message: Message, arg: IBaseTypeArg) {
		let snowflake = "";
		const name = "";
		if (arg.value.startsWith("<")) {
			snowflake = arg.value.replace(/[<@#>]/g, "");
		} else if (!isNaN(parseInt(arg.value, 10))) {
			snowflake = arg.value;
		}

		if (snowflake === "") {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not parse \`${arg.value}\` to type \`${
					this.string
				}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		}
		const channel = message.guild.channels.get(snowflake) as
			| TextChannel
			| VoiceChannel
			| GuildChannel;

		const channelFromName = message.guild.channels.find(
			(v) => v.name === arg.value,
		) as TextChannel | VoiceChannel | GuildChannel;
		if (!channel && !channelFromName) {
			throw new SyntaxParseError({
				expectedArgument: this,
				message: `could not find channel \`${arg.value}\``,
				recievedArgument: arg,
				type: "PARSE_FAILED",
			});
		} else if (channel) {
			return channel;
		} else {
			return channelFromName;
		}
	}
}
