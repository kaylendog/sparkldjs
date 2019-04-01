import { TailClient } from "../client/Client";
import { Module } from "./Module";
export declare interface ModuleWithConfig<Config extends {}> extends Module {
    onConfigUpdate(config?: Config, oldConfig?: Config): any;
}
/**
 * A module with a built-in config system.
 */
export declare class ModuleWithConfig<Config extends {}> extends Module {
    config: Readonly<Config>;
    constructor(client: TailClient);
    /**
     * Updates the module's config.
     * @param {Config} config - The new config to patch into the module
     */
    updateConfig<K extends keyof Config>(config: ((prevConfig: Readonly<Config>) => Pick<Config, K> | Config | null) | (Pick<Config, K> | Config | null)): void;
}
