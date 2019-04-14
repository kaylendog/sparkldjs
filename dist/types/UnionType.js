"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const BaseType_1 = require("./BaseType");
/**
 * Type for combining types - just a bit of typeception
 */
class UnionType extends BaseType_1.BaseType {
    constructor(opts) {
        super(opts);
        this.options = {
            argName: opts.argName,
            required: opts.required || false,
            rest: opts.rest,
            typeName: "union",
            types: opts.types,
        };
        if (opts.types.find((v) => v.options.typeName === "union")) {
            throw Error("Found a union type in a union type - that's never a good idea.");
        }
    }
    match(client, message, arg) {
        const allHaveFailed = false;
        let totalFailed = 0;
        const values = [];
        this.options.types.map((v) => {
            try {
                values.push(v.match(client, message, arg));
            }
            catch (err) {
                if (err instanceof SyntaxParseError_1.SyntaxParseError) {
                    totalFailed += 1;
                }
                else {
                    throw err;
                }
            }
        });
        if (totalFailed === this.options.types.length || allHaveFailed) {
            throw new SyntaxParseError_1.SyntaxParseError({
                expectedArgument: this,
                message: `could not parse \`${arg.value}\` to type \`${this.string}\``,
                recievedArgument: arg,
                type: "PARSE_FAILED",
            });
        }
        else {
            return values[0];
        }
    }
    get string() {
        return `${this.options.required ? "<" : "["}${this.options.argName}:${this.options.types.map((v) => v.options.typeName).join("|")}${this.options.rest ? "..." : ""}${this.options.required ? ">" : "]"}`;
    }
}
exports.UnionType = UnionType;
