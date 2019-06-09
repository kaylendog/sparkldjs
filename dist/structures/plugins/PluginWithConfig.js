"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plugin_1 = require("./Plugin");
/**
 * A Plugin with a built-in config system.
 */
class PluginWithConfig extends Plugin_1.Plugin {
    constructor(client) {
        super(client);
        this.config = {};
    }
    /**
     * Updates the Plugin's config.
     * @param {Config} config - The new config to patch into the Plugin
     */
    updateConfig(config) {
        const old = this.config;
        this.config = Object.assign(this.config, config);
        if (this.onConfigUpdate) {
            this.onConfigUpdate(this.config, old);
        }
    }
}
exports.PluginWithConfig = PluginWithConfig;
