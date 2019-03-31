import {
	GuildChannel,
	GuildMember,
	Role as DJSRole,
	TextChannel,
	User as DJSUser,
	VoiceChannel,
} from "discord.js";

export type Role = DJSRole;
export type Channel = GuildChannel | TextChannel | VoiceChannel;
export type Member = GuildMember;
export type Duration = number;
export type User = DJSUser;

export type SyntaxParsable =
	| Role
	| Channel
	| Member
	| Duration
	| User
	| string
	| number;
