import { Message } from "discord.js";

import { Module, TailClient } from "../src";

const bot = new TailClient();

bot.module("base", function(this: Module) {
	this.client.on("message", (m: Message) => {
		this.client.logger.log(`${m.author.tag}: ${m.cleanContent}`);
	});
});

bot.start("NTEzODM3ODYyODMyMTc3MjAy.XJ9Tnw.BiTyFQKYI9B2puZUHk7RxqfHKKs");
