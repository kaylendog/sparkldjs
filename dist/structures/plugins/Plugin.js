"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Object for dynamically interacting with the Client
 */
class Plugin {
    constructor(client) {
        this.client = client;
        this.logger = this.client.logger;
        if (this.constructor.name === "Plugin") {
            throw new Error("The base Plugin cannot be instantiated.");
        }
    }
    /**
     * Initialises the plugin
     * @return {*}
     * @abstract
     */
    async init() {
        return;
    }
    /**
     * Called when the plugin is being reloaded
     * @return {*}
     * @abstract
     */
    async reload() {
        return;
    }
    /**
     * Initialises the plugin
     * @return {*}
     * @abstract
     */
    async destroy() {
        return;
    }
    /**
     * Adds a removable event listener to the client - used for reloading.
     * @param {String} event - The event name
     * @param {*} listener - The listener to use
     * @return {Plugin} The plugin object
     * @abstract
     */
    on(event, listener) {
        this.client.on(event, listener, this.constructor.name);
        throw new Error(`${this.constructor.name} doesn't have an on method.`);
    }
    onPluginWillStart() {
        return;
    }
    onReceiveMessage() {
        return;
    }
    command(name, permissionLevel, syntax, exec) {
        this.client.command(name, permissionLevel, syntax, exec);
        return this;
    }
}
exports.Plugin = Plugin;
function plugin(name, init) {
    return (client) => {
        const m = new Plugin(client);
        m.pluginName = name;
        m.init = init;
        return m;
    };
}
exports.plugin = plugin;
