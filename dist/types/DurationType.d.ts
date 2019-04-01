import { Message } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export declare class DurationType extends BaseType {
    options: BaseTypeOptions;
    constructor(typeOptions: BaseTypeOptions);
    match(client: TailClient, message: Message, arg: IBaseTypeArg): number;
}
