"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("./Module");
/**
 * A module with a built-in config system.
 */
class ModuleWithConfig extends Module_1.Module {
    constructor(client) {
        super(client);
        this.config = {};
    }
    /**
     * Updates the module's config.
     * @param {Config} config - The new config to patch into the module
     */
    updateConfig(config) {
        const old = this.config;
        this.config = Object.assign(this.config, config);
        this.onConfigUpdate(this.config, old);
    }
}
exports.ModuleWithConfig = ModuleWithConfig;
