import { GuildChannel, GuildMember, Role as DJSRole, TextChannel, User as DJSUser, VoiceChannel } from "discord.js";
export declare type Role = DJSRole;
export declare type Channel = GuildChannel | TextChannel | VoiceChannel;
export declare type Member = GuildMember;
export declare type Duration = number;
export declare type User = DJSUser;
export declare type SyntaxParsable = Role | Channel | Member | Duration | User | string | number;
