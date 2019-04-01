"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const BaseType_1 = require("./BaseType");
class RoleType extends BaseType_1.BaseType {
    constructor(opts) {
        super(opts);
        this.options = {
            argName: opts.argName,
            required: opts.required || false,
            rest: opts.rest,
            typeName: "role",
        };
    }
    match(client, message, arg) {
        let snowflake = "";
        let name = "";
        if (arg.value.startsWith("<")) {
            snowflake = arg.value.replace(/[<@#!&>]/g, "");
        }
        else if (!isNaN(parseInt(arg.value, 10))) {
            snowflake = arg.value;
        }
        else {
            name = arg.value;
        }
        if (snowflake === "" && name === "") {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not parse \`${arg.value}\` to type \`${this.string}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        const roleSnowflake = message.guild.roles.get(snowflake);
        const roleName = message.guild.roles.find((v) => v.name === name);
        if (roleSnowflake) {
            return roleSnowflake;
        }
        if (roleName) {
            return roleName;
        }
        throw new SyntaxParseError_1.SyntaxParseError({
            expectedArgument: this,
            message: `could not find role \`${arg.value}\``,
            recievedArgument: arg,
            type: "PARSE_FAILED",
        });
    }
}
exports.RoleType = RoleType;
