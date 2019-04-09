import { Message } from "discord.js";
import { SparklClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export declare class RoleType extends BaseType {
    options: BaseTypeOptions;
    constructor(opts: BaseTypeOptions);
    match(client: SparklClient, message: Message, arg: IBaseTypeArg): import("discord.js").Role;
}
