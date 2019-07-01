import { Message } from "discord.js";
import * as winston from "winston";
import { SparklClient } from "../../client/Client";
export declare interface Plugin {
    pluginName: string;
    client: SparklClient;
    init(): Promise<any>;
    reload(): Promise<any>;
    destroy(): Promise<any>;
    sendMessage(dest: string, type: string, ...data: any[]): any;
    onPluginWillStart(): any;
    onReceiveMessage(type: string, ...data: any[]): any;
}
export declare type PluginConstructor = new (c: SparklClient) => Plugin;
/**
 * Object for dynamically interacting with the Client
 */
export declare class Plugin {
    static pluginName: string;
    client: SparklClient;
    logger: winston.Logger;
    constructor(client: SparklClient);
    command(name: string, permissionLevel: number, syntax: string, exec: (c: SparklClient, m: Message, a: any[]) => any): this;
    on(eventName: string, listener: (...args: any) => any): this;
}
export declare function plugin(name: string, init: () => any): (client: SparklClient) => Plugin;
