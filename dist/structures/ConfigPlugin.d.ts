import { GuildResolvable } from "discord.js";
import { TailClient } from "../client/Client";
export interface BaseGuildPermissions {
    commandPermissionOverrides?: {
        [x: string]: number;
    };
    users?: {
        [x: string]: number;
    };
    roles?: {
        [x: string]: number;
    };
}
export interface BaseGuildConfig {
    prefix: string;
    permissions: BaseGuildPermissions;
}
export interface BaseConfig<G extends BaseGuildConfig> {
    guilds: {
        [x: string]: G;
    };
    commandPermmisions: {
        [x: string]: number;
    };
}
export interface BaseDefaultConfig<G> {
    guilds: G;
}
export declare interface ConfigPlugin<S extends BaseConfig<G>, G extends BaseGuildConfig, D extends BaseDefaultConfig<G>> {
    fetchGuildConfig(id: GuildResolvable): G | Promise<G>;
}
export declare type ConfigPluginConstructor<S extends BaseConfig<G>, G extends BaseGuildConfig, D extends BaseDefaultConfig<G>> = new (c: TailClient, conf: S, defaults: D) => ConfigPlugin<S, G, D>;
export declare class ConfigPlugin<S extends BaseConfig<G>, G extends BaseGuildConfig, D extends BaseDefaultConfig<G>> {
    client: TailClient;
    protected config: S;
    protected defaults: D;
    constructor(client: TailClient, config: S, defaults: D);
    intialise(): Promise<void>;
}
