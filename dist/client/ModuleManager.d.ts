import { Module, ModuleConstructor } from "../structures/Module";
import { TailClient } from "./Client";
export declare class ModuleManager {
    client: TailClient;
    private modules;
    constructor(client: TailClient);
    /**
     * Adds a module to the client
     * @param {Module | ModuleConstructor} module
     */
    addModule(module: ModuleConstructor | Module): void;
    /**
     * Creates a new module
     * @param {object} data - Module data
     * @param {string} data.name - Name of the module
     */
    createModule(name: string, start: () => any): void;
    /**
     * Number of modules stored
     */
    readonly moduleCount: number;
}
