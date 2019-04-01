"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("util"));
const BaseType_1 = require("./BaseType");
class StringType extends BaseType_1.BaseType {
    constructor(typeOptions) {
        super(typeOptions);
        this.options = {
            argName: typeOptions.argName,
            required: typeOptions.required || false,
            rest: typeOptions.rest,
            typeName: "string",
        };
        this.options.maxLength = typeOptions.maxLength;
        this.options.minLength = typeOptions.minLength;
    }
    match(client, message, arg) {
        const str = util.inspect(arg.value).replace(/[']/g, "");
        if (this.options.maxLength) {
            if (str.length > this.options.maxLength) {
                return false;
            }
        }
        if (this.options.minLength) {
            if (str.length < this.options.minLength) {
                return false;
            }
        }
        return str;
    }
}
exports.StringType = StringType;
