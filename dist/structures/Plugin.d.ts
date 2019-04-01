import { Client } from "discord.js";
import { TailClient } from "../client/Client";
import { Logger } from "../util/Logger";
export declare interface Plugin {
    pluginName: string;
    client: TailClient;
    start(): any;
    sendMessage(dest: string, type: string, ...data: any[]): any;
    onPluginWillStart(): any;
    onReceiveMessage(type: string, ...data: any[]): any;
}
export declare type PluginConstructor = new (c: TailClient) => Plugin;
export declare class Plugin {
    static pluginName: string;
    client: TailClient;
    logger: Logger;
    discord: Client;
    constructor(client: TailClient);
}
export declare function plugin(name: string, onStart: () => any): (client: TailClient) => Plugin;
