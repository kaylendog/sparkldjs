import { Message } from "discord.js";
import { TailClient } from "../client/Client";
export interface BaseTypeOptions {
    typeName?: string;
    argName: string;
    required?: boolean;
    rest?: boolean;
}
export interface IBaseTypeArg {
    value: string;
    index: number;
}
export declare class BaseType {
    options: BaseTypeOptions;
    constructor(options: BaseTypeOptions);
    optional(): this;
    rest(): this;
    match(client: TailClient, message: Message, arg: IBaseTypeArg): void;
    readonly string: string;
}
