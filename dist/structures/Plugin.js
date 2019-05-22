"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor(client) {
        this.client = client;
        this.logger = this.client.logger;
    }
}
exports.Plugin = Plugin;
function plugin(name, onStart) {
    return (client) => {
        const m = new Plugin(client);
        m.pluginName = name;
        m.start = onStart;
        return m;
    };
}
exports.plugin = plugin;
