import { TailClient } from "../client/Client";
import { Plugin } from "./Plugin";
export declare interface PluginWithConfig<Config extends {}> extends Plugin {
    onConfigUpdate(config?: Config, oldConfig?: Config): any;
}
/**
 * A Plugin with a built-in config system.
 */
export declare class PluginWithConfig<Config extends {}> extends Plugin {
    config: Readonly<Config>;
    constructor(client: TailClient);
    /**
     * Updates the Plugin's config.
     * @param {Config} config - The new config to patch into the Plugin
     */
    updateConfig<K extends keyof Config>(config: ((prevConfig: Readonly<Config>) => Pick<Config, K> | Config | null) | (Pick<Config, K> | Config | null)): void;
}
