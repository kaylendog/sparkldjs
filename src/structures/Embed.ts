import { RichEmbed, RichEmbedOptions } from "discord.js";

import { SparklClient } from "../client/Client";

export class Embed extends RichEmbed {
	public client: SparklClient;

	constructor(client: SparklClient, opts?: RichEmbedOptions) {
		super(opts);
		this.client = client;

		this.setFooter(client.options.name, client.user.avatarURL);
		this.setColor(0x7289da);
		this.setTimestamp();
	}
}
