import { Message } from "discord.js";
import { SparklClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export interface INumberTypeOptions extends BaseTypeOptions {
    maxValue?: number;
    minValue?: number;
}
export declare class NumberType extends BaseType {
    options: INumberTypeOptions;
    constructor(typeOptions: INumberTypeOptions);
    match(client: SparklClient, message: Message, arg: IBaseTypeArg): number;
}
