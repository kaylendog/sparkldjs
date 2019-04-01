import { Message } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export interface INumberTypeOptions extends BaseTypeOptions {
    maxValue?: number;
    minValue?: number;
}
export declare class NumberType extends BaseType {
    options: INumberTypeOptions;
    constructor(typeOptions: INumberTypeOptions);
    match(client: TailClient, message: Message, arg: IBaseTypeArg): number;
}
