import { Plugin, PluginConstructor } from "../structures/Plugin";
import { SparklClient } from "./Client";
export declare class PluginManager {
    client: SparklClient;
    private plugins;
    private hasStarted;
    constructor(client: SparklClient);
    /**
     * Adds a module to the client
     * @param {Plugin | PluginConstructor} module
     */
    addPlugin(module: PluginConstructor | Plugin): Promise<void>;
    /**
     * Creates a new module
     * @param {object} data - Plugin data
     * @param {string} data.name - Name of the module
     */
    createPlugin(name: string, start: () => any): void;
    /**
     * Number of plugins stored
     */
    readonly pluginCount: number;
    sendMessage(dest: string, type: string, ...data: any[]): void;
}
