import { Collection, Guild } from "discord.js";
import { SparklClient } from "../../client/Client";
import { BaseGuildConfig, ConfigProvider } from "./ConfigProvider";
export declare class DefaultConfigProvider extends ConfigProvider {
    config: Collection<string, BaseGuildConfig>;
    constructor();
    init(client: SparklClient): void;
    destroy(): void;
    get(guild: Guild | string, key: string, defVal: any): any;
    set(guild: Guild | string, key: string, val: any): Promise<any>;
    remove(guild: Guild | string, key: string): Promise<any>;
    clear(guild: Guild | string): Promise<void>;
}
