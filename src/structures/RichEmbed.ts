import { RichEmbed as DJSEmbed, RichEmbedOptions } from "discord.js";

import { TailClient } from "../client/Client";

class Embed extends DJSEmbed {
	constructor(c: TailClient, opts?: RichEmbedOptions) {
		super(opts);
		this.setTimestamp();
		this.setFooter(c.options);
	}
}
