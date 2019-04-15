import { ChannelType } from "./types/ChannelType";
import { DurationType } from "./types/DurationType";
import { MemberType } from "./types/MemberType";
import { NumberType } from "./types/NumberType";
import { RoleType } from "./types/RoleType";
import { StringType } from "./types/StringType";
import { UserType } from "./types/UserType";

export { SparklClient } from "./client/Client";
export { Plugin } from "./structures/Plugin";
export { PluginWithConfig } from "./structures/PluginWithConfig";
export { Command } from "./structures/Command";
export {
	BaseConfig,
	BaseDefaultConfig,
	BaseGuildConfig,
	BaseGuildPermissions,
	ConfigPlugin,
} from "./structures/ConfigPlugin";

export { Embed } from "./structures/Embed";

export const SyntaxTypes = {
	ChannelType,
	DurationType,
	MemberType,
	NumberType,
	RoleType,
	StringType,
	UserType,
};
