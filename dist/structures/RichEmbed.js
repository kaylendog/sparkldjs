"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed extends discord_js_1.RichEmbed {
    constructor(c, opts) {
        super(opts);
        this.setTimestamp();
        this.setFooter(c.options);
    }
}
