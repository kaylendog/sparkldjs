import { GuildChannel, GuildMember, Role as DJSRole, TextChannel, User as DJSUser, VoiceChannel } from "discord.js";
export declare type Role = DJSRole;
export declare type Channel = GuildChannel | TextChannel | VoiceChannel;
export declare type Member = GuildMember;
export declare type Duration = number;
export declare type User = DJSUser;
export declare type SyntaxParsable = Channel | Duration | Member | number | Role | string | User;
export declare type SyntaxString = "channel" | "duration" | "member" | "number" | "role" | "string" | "user";
export declare const VALID_SYNTAX_STRINGS: SyntaxString[];
