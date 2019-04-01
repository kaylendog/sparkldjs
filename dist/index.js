"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelType_1 = require("./types/ChannelType");
const DurationType_1 = require("./types/DurationType");
const MemberType_1 = require("./types/MemberType");
const NumberType_1 = require("./types/NumberType");
const RoleType_1 = require("./types/RoleType");
const StringType_1 = require("./types/StringType");
const UserType_1 = require("./types/UserType");
var Client_1 = require("./client/Client");
exports.TailClient = Client_1.TailClient;
var Plugin_1 = require("./structures/Plugin");
exports.Plugin = Plugin_1.Plugin;
var PluginWithConfig_1 = require("./structures/PluginWithConfig");
exports.PluginWithConfig = PluginWithConfig_1.PluginWithConfig;
var Command_1 = require("./structures/Command");
exports.Command = Command_1.Command;
exports.SyntaxTypes = {
    ChannelType: ChannelType_1.ChannelType,
    DurationType: DurationType_1.DurationType,
    MemberType: MemberType_1.MemberType,
    NumberType: NumberType_1.NumberType,
    RoleType: RoleType_1.RoleType,
    StringType: StringType_1.StringType,
    UserType: UserType_1.UserType,
};
