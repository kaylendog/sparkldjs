import * as winston from "winston";
import { SparklClient } from "../client/Client";
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
export declare class Plugin {
    static pluginName: string;
    client: SparklClient;
    logger: winston.Logger;
    constructor(client: SparklClient);
    /**
     * Adds a removable event listener to the client - used for reloading.
     * @param {String} event - The event name
     * @param {*} listener - The listener to use
     * @return {Plugin} The plugin object
     * @abstract
     */
    on(event: string, listener: any): this;
}
export declare function plugin(name: string, init: () => any): (client: SparklClient) => Plugin;
