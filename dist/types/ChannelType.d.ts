import { Message, TextChannel, VoiceChannel } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
export declare class ChannelType extends BaseType {
    options: BaseTypeOptions;
    constructor(opts: BaseTypeOptions);
    match(client: TailClient, message: Message, arg: IBaseTypeArg): VoiceChannel | TextChannel;
}
