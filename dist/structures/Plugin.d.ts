import * as winston from "winston";
import { SparklClient } from "../client/Client";
export declare interface Plugin {
    pluginName: string;
    client: SparklClient;
    start(): any;
    sendMessage(dest: string, type: string, ...data: any[]): any;
    onPluginWillStart(): any;
    onReceiveMessage(type: string, ...data: any[]): any;
}
export declare type PluginConstructor = new (c: SparklClient) => Plugin;
export declare class Plugin {
    static pluginName: string;
    client: SparklClient;
    logger: winston.Logger;
    constructor(client: SparklClient);
}
export declare function plugin(name: string, onStart: () => any): (client: SparklClient) => Plugin;
