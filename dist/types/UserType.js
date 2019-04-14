"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const BaseType_1 = require("./BaseType");
class UserType extends BaseType_1.BaseType {
    constructor(opts) {
        super(opts);
        this.options = {
            argName: opts.argName,
            required: opts.required || false,
            rest: opts.rest,
            typeName: "user",
        };
    }
    match(client, message, arg) {
        let snowflake = "";
        let tag = "";
        if (arg.value.startsWith("<")) {
            snowflake = arg.value.replace(/[<@#!&>]/g, "");
        }
        else if (!isNaN(parseInt(arg.value, 10))) {
            snowflake = arg.value;
        }
        if (arg.value.match(/.*#[0-9]{4}/)) {
            tag = arg.value;
        }
        if (snowflake === "" && tag === "") {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not parse \`${arg.value}\` to type \`${this.string}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        const user = client.discord.users.find((v) => v.id === snowflake || v.tag === tag);
        if (!user) {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not find user \`${arg.value}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        else {
            return user;
        }
    }
}
exports.UserType = UserType;
