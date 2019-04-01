"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Module_1 = require("../structures/Module");
class ModuleManager {
    constructor(client) {
        this.client = client;
        this.modules = new discord_js_1.Collection();
        this.client.on("ready", async () => {
            this.client.logger.debug(`Warming up modules - ${this.moduleCount} module(s) to start...`);
            // Wait for modules to start
            const moduleWillStartIterator = this.modules.map(async (v) => await (v.onModuleWillStart ? v.onModuleWillStart() : null));
            await Promise.all(moduleWillStartIterator);
            // Synchronously start modules
            this.modules.forEach((v) => (v.start ? v.start() : null));
            this.client.logger.log("Done.");
        });
    }
    /**
     * Adds a module to the client
     * @param {Module | ModuleConstructor} module
     */
    addModule(module) {
        let m;
        if (module instanceof Module_1.Module) {
            m = module;
        }
        else {
            m = new module(this.client);
        }
        this.modules.set(m.moduleName, m);
    }
    /**
     * Creates a new module
     * @param {object} data - Module data
     * @param {string} data.name - Name of the module
     */
    createModule(name, start) {
        const moduleToAdd = new Module_1.Module(this.client);
        moduleToAdd.moduleName = name;
        moduleToAdd.start = start;
        this.addModule(moduleToAdd);
    }
    /**
     * Number of modules stored
     */
    get moduleCount() {
        return this.modules.size;
    }
}
exports.ModuleManager = ModuleManager;
