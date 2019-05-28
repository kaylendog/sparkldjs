"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    init() {
        throw new Error(`${this.constructor.name} doesn't have an init method.`);
    }
    /**
     * Called when the plugin is being reloaded
     * @return {*}
     * @abstract
     */
    reload() {
        throw new Error(`${this.constructor.name} doesn't have a reload method.`);
    }
    /**
     * Initialises the plugin
     * @return {*}
     * @abstract
     */
    destroy() {
        throw new Error(`${this.constructor.name} doesn't have a destroy method.`);
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
        throw new Error(`${this.constructor.name} doesn't have an onPluginWillStart method.`);
    }
    onReceiveMessage() {
        throw new Error(`${this.constructor.name} doesn't have an onReceiveMessage method.`);
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
