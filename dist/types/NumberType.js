"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const BaseType_1 = require("./BaseType");
class NumberType extends BaseType_1.BaseType {
    constructor(typeOptions) {
        super(typeOptions);
        this.options = {
            argName: typeOptions.argName,
            required: typeOptions.required || false,
            rest: typeOptions.rest,
            typeName: "number",
        };
        this.options.maxValue = typeOptions.maxValue;
        this.options.minValue = typeOptions.minValue;
    }
    match(client, message, arg) {
        const int = parseInt(arg.value, 10);
        if (isNaN(int)) {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not parse \`${arg.value}\` to type \`${this.string}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        if (this.options.maxValue) {
            if (int > this.options.maxValue) {
                throw new SyntaxParseError_1.SyntaxParseError({
                    expectedArgument: this,
                    message: `number \`${arg.value}\` is out of range \`${arg.value}\` to type \`${this.string}\``,
                    recievedArgument: arg,
                    type: "PARSE_FAILED",
                });
            }
        }
        if (this.options.minValue) {
            if (int < this.options.minValue) {
                throw new SyntaxParseError_1.SyntaxParseError({
                    expectedArgument: this,
                    message: `number \`${arg.value}\` is out of range \`${arg.value}\` to type \`${this.string}\``,
                    recievedArgument: arg,
                    type: "PARSE_FAILED",
                });
            }
        }
        return int;
    }
}
exports.NumberType = NumberType;
