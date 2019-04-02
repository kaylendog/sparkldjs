"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Plugin_1 = require("../structures/Plugin");
class PluginManager {
    constructor(client) {
        this.client = client;
        this.plugins = new discord_js_1.Collection();
        this.hasStarted = false;
        this.client.on("ready", async () => {
            this.client.logger.debug(`Warming up plugins - ${this.pluginCount} module(s) to start...`);
            // Wait for plugins to start
            const pluginWillStartIterator = this.plugins.map(async (v) => await (v.onPluginWillStart ? v.onPluginWillStart() : null));
            await Promise.all(pluginWillStartIterator);
            // Synchronously start plugins
            this.plugins.forEach((v) => (v.start ? v.start() : null));
            this.client.logger.log("Done.");
            this.hasStarted = true;
        });
    }
    /**
     * Adds a module to the client
     * @param {Plugin | PluginConstructor} module
     */
    async addPlugin(module) {
        let m;
        if (module instanceof Plugin_1.Plugin) {
            m = module;
        }
        else {
            console.log("Constructing...");
            m = new module(this.client);
        }
        this.plugins.set(m.pluginName, m);
        if (this.hasStarted) {
            await m.onPluginWillStart();
            m.start();
        }
    }
    /**
     * Creates a new module
     * @param {object} data - Plugin data
     * @param {string} data.name - Name of the module
     */
    createPlugin(name, start) {
        const moduleToAdd = new Plugin_1.Plugin(this.client);
        moduleToAdd.pluginName = name;
        moduleToAdd.start = start;
        this.addPlugin(moduleToAdd);
    }
    /**
     * Number of plugins stored
     */
    get pluginCount() {
        return this.plugins.size;
    }
    sendMessage(dest, type, ...data) {
        const plugin = this.plugins.get("dest");
        if (plugin) {
            plugin.onReceiveMessage(type, data);
        }
    }
}
exports.PluginManager = PluginManager;
