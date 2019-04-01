"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const BaseType_1 = require("./BaseType");
class DurationType extends BaseType_1.BaseType {
    constructor(typeOptions) {
        super(typeOptions);
        this.options = {
            argName: typeOptions.argName,
            required: typeOptions.required || false,
            rest: typeOptions.rest,
            typeName: "duration",
        };
    }
    match(client, message, arg) {
        let multiplier;
        const unit = arg.value.slice(-1);
        const value = parseInt(arg.value.slice(0, arg.value.length - 1), 10);
        if (isNaN(value)) {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not parse \`${arg.value}\` to type \`${this.string}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        switch (unit) {
            // Seconds
            case "s": {
                multiplier = 1;
                break;
            }
            // Minutes
            case "m": {
                multiplier = 60;
                break;
            }
            // Hours
            case "h": {
                multiplier = 60 * 60;
                break;
            }
            // Days
            case "d": {
                multiplier = 60 * 60 * 24;
                break;
            }
            // Weeks
            case "w": {
                multiplier = 60 * 60 * 24 * 7;
                break;
            }
            // Years
            case "y": {
                multiplier = 60 * 60 * 24 * 7 * 365;
                break;
            }
            default: {
                throw new SyntaxParseError_1.SyntaxParseError({
                    expectedArgument: this,
                    message: `could not parse \`${arg.value}\` to type \`${this.string}\``,
                    recievedArgument: arg,
                    type: "PARSE_FAILED",
                });
            }
        }
        if (isNaN(value * multiplier * 1000)) {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not parse \`${arg.value}\` to type \`${this.string}\` - extraneous value`,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        return value * multiplier * 1000;
    }
}
exports.DurationType = DurationType;
