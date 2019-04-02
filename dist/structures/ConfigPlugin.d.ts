import { GuildResolvable } from "discord.js";
import { TailClient } from "../client/Client";
interface BaseGuildConfig {
    prefix: string;
}
export interface BaseConfig {
    guilds?: {
        [x: string]: BaseGuildConfig;
    };
}
export interface BaseDefaultConfig {
    guilds: BaseGuildConfig;
}
export declare interface ConfigPlugin<S extends BaseConfig, D extends BaseDefaultConfig> {
    fetchGuildConfig(id: GuildResolvable): BaseGuildConfig | Promise<BaseGuildConfig>;
}
export declare type ConfigPluginConstructor<S extends BaseConfig, D extends BaseDefaultConfig> = new (c: TailClient, conf: S, defaults: D) => ConfigPlugin<S, D>;
export declare class ConfigPlugin<S extends BaseConfig, D extends BaseDefaultConfig> {
    client: TailClient;
    private config;
    private defaults;
    constructor(client: TailClient, config: S, defaults: D);
    intialise(): Promise<void>;
}
export {};
