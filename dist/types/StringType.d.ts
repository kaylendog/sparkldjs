import { Message } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export interface IStringTypeOptions extends BaseTypeOptions {
    maxLength?: number;
    minLength?: number;
}
export declare class StringType extends BaseType {
    options: IStringTypeOptions;
    constructor(typeOptions: IStringTypeOptions);
    match(client: TailClient, message: Message, arg: IBaseTypeArg): string | false;
}
