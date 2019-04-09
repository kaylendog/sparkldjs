"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ConfigPlugin {
    constructor(client, config, defaults) {
        this.client = client;
        this.config = config;
        this.defaults = defaults;
    }
    fetchGuildConfig(g) {
        return this.config.guilds
            ? this.config.guilds[g instanceof discord_js_1.Guild ? g.id : g] ||
                this.defaults.guilds
            : this.defaults.guilds;
    }
    async intialise() {
        return;
    }
}
exports.ConfigPlugin = ConfigPlugin;
