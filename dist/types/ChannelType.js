"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const BaseType_1 = require("./BaseType");
class ChannelType extends BaseType_1.BaseType {
    constructor(opts) {
        super(opts);
        this.options = {
            argName: opts.argName,
            required: opts.required || false,
            rest: opts.rest,
            typeName: "channel",
        };
    }
    match(client, message, arg) {
        let snowflake = "";
        if (arg.value.startsWith("<")) {
            snowflake = arg.value.replace(/[<@#>]/g, "");
        }
        else if (!isNaN(parseInt(arg.value, 10))) {
            snowflake = arg.value;
        }
        if (snowflake === "") {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not parse \`${arg.value}\` to type \`${this.string}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        const channel = client.channels.get(snowflake);
        if (!channel) {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not find channel \`${arg.value}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        else {
            if (channel instanceof discord_js_1.DMChannel ||
                channel instanceof discord_js_1.GroupDMChannel) {
                throw new SyntaxParseError_1.SyntaxParseError({
                    expectedArgument: this,
                    message: `could not find channel \`${arg.value}\``,
                    recievedArgument: arg,
                    type: "PARSE_FAILED",
                });
            }
            else if (channel.guild.id !== message.guild.id) {
                throw new SyntaxParseError_1.SyntaxParseError({
                    expectedArgument: this,
                    message: `could not find channel \`${arg.value}\``,
                    recievedArgument: arg,
                    type: "PARSE_FAILED",
                });
            }
            else {
                return channel;
            }
        }
    }
}
exports.ChannelType = ChannelType;
