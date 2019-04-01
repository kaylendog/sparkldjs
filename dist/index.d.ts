import { ChannelType } from "./types/ChannelType";
import { DurationType } from "./types/DurationType";
import { MemberType } from "./types/MemberType";
import { NumberType } from "./types/NumberType";
import { RoleType } from "./types/RoleType";
import { StringType } from "./types/StringType";
export { TailClient } from "./client/Client";
export { Module } from "./structures/Module";
export { ModuleWithConfig } from "./structures/ModuleWithConfig";
export { Command } from "./structures/Command";
export declare const SyntaxTypes: {
    ChannelType: typeof ChannelType;
    DurationType: typeof DurationType;
    MemberType: typeof MemberType;
    NumberType: typeof NumberType;
    RoleType: typeof RoleType;
    StringType: typeof StringType;
};
