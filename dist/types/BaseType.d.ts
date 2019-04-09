import { Message } from "discord.js";
import { SparklClient } from "../client/Client";
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
    match(client: SparklClient, message: Message, arg: IBaseTypeArg): void;
    readonly string: string;
}
