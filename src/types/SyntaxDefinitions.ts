import {
    GuildChannel, GuildMember, Role as DJSRole, TextChannel, User as DJSUser, VoiceChannel
} from "discord.js";

export type Role = DJSRole;
export type Channel = GuildChannel | TextChannel | VoiceChannel;
export type Member = GuildMember;
export type Duration = number;
export type User = DJSUser;

export type SyntaxParsable =
	| Channel
	| Duration
	| Member
	| number
	| Role
	| string
	| User;

export type SyntaxString =
	| "channel"
	| "duration"
	| "member"
	| "number"
	| "role"
	| "string"
	| "user";

export const VALID_SYNTAX_STRINGS: SyntaxString[] = [
	"channel",
	"duration",
	"member",
	"number",
	"role",
	"string",
	"user",
];
