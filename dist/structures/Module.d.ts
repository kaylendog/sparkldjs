import { TailClient } from "../client/Client";
export declare interface Module {
    moduleName: string;
    client: TailClient;
    start(): any;
    onModuleWillStart(): any;
}
export declare type ModuleConstructor = new (c: TailClient) => Module;
export declare class Module {
    static moduleName: string;
    client: TailClient;
    constructor(client: TailClient);
}
export declare function module(name: string, onStart: () => any): (client: TailClient) => Module;
