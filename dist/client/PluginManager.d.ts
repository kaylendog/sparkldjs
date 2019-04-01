import { Plugin, PluginConstructor } from "../structures/Plugin";
import { TailClient } from "./Client";
export declare class PluginManager {
    client: TailClient;
    private plugins;
    private hasStarted;
    constructor(client: TailClient);
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
