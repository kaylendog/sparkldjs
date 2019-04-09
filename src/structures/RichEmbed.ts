import { RichEmbed as DJSEmbed, RichEmbedOptions } from "discord.js";

import { SparklClient } from "../client/Client";

class Embed extends DJSEmbed {
	constructor(c: SparklClient, opts?: RichEmbedOptions) {
		super(opts);
		this.setTimestamp();
		this.setFooter(c.options);
	}
}
