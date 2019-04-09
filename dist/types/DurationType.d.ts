import { Message } from "discord.js";
import { SparklClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export declare class DurationType extends BaseType {
    options: BaseTypeOptions;
    constructor(typeOptions: BaseTypeOptions);
    match(client: SparklClient, message: Message, arg: IBaseTypeArg): number;
}
