"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed extends discord_js_1.RichEmbed {
    constructor(client, opts) {
        super(opts);
        this.client = client;
        this.setFooter(client.options.name, client.discord.user.avatarURL);
        this.setColor(0x7289da);
        this.setTimestamp();
    }
}
exports.Embed = Embed;
