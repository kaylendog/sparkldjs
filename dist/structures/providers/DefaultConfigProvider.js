"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ConfigProvider_1 = require("./ConfigProvider");
class DefaultConfigProvider extends ConfigProvider_1.ConfigProvider {
    constructor() {
        super();
        this.config = new discord_js_1.Collection();
    }
    init(client) {
        client.guilds.map((v) => this.config.has(v.id)
            ? this.config.set(v.id, Object.assign({ prefix: "!" }, this.config.get(v.id)))
            : this.config.set(v.id, { prefix: "!" }));
        return;
    }
    destroy() {
        this.config.deleteAll();
    }
    get(guild, key, defVal) {
        const id = guild instanceof discord_js_1.Guild ? guild.id : guild;
        const config = this.config.get(id);
        return config ? (config[key] ? config[key] : defVal) : defVal;
    }
    async set(guild, key, val) {
        const id = guild instanceof discord_js_1.Guild ? guild.id : guild;
        if (!this.config.has(id)) {
            this.config.set(id, Object.assign({ prefix: "!" }, { [key]: val }));
        }
        else {
            let config = this.config.get(id);
            config = Object.assign(config, { [key]: val });
            this.config.set(id, config);
        }
    }
    async remove(guild, key) {
        const id = guild instanceof discord_js_1.Guild ? guild.id : guild;
        if (!this.config.has(id)) {
            return null;
        }
        else {
            const config = this.config.get(id);
            if (!config[key]) {
                return null;
            }
            else {
                const val = config[key];
                delete config[key];
                return val;
            }
        }
    }
    async clear(guild) {
        const id = guild instanceof discord_js_1.Guild ? guild.id : guild;
        this.config.set(id, { prefix: "!" });
    }
}
exports.DefaultConfigProvider = DefaultConfigProvider;
