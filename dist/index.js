"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelType_1 = require("./types/ChannelType");
const DurationType_1 = require("./types/DurationType");
const MemberType_1 = require("./types/MemberType");
const NumberType_1 = require("./types/NumberType");
const RoleType_1 = require("./types/RoleType");
const StringType_1 = require("./types/StringType");
var Client_1 = require("./client/Client");
exports.TailClient = Client_1.TailClient;
var Module_1 = require("./structures/Module");
exports.Module = Module_1.Module;
var ModuleWithConfig_1 = require("./structures/ModuleWithConfig");
exports.ModuleWithConfig = ModuleWithConfig_1.ModuleWithConfig;
var Command_1 = require("./structures/Command");
exports.Command = Command_1.Command;
exports.SyntaxTypes = {
    ChannelType: ChannelType_1.ChannelType,
    DurationType: DurationType_1.DurationType,
    MemberType: MemberType_1.MemberType,
    NumberType: NumberType_1.NumberType,
    RoleType: RoleType_1.RoleType,
    StringType: StringType_1.StringType,
};
