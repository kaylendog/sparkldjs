import { GuildChannel, Message } from "discord.js";
import { SparklClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export declare class ChannelType extends BaseType {
    options: BaseTypeOptions;
    constructor(opts: BaseTypeOptions);
    match(client: SparklClient, message: Message, arg: IBaseTypeArg): GuildChannel;
}
