"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseType {
    constructor(options) {
        this.options = options;
    }
    optional() {
        this.options.required = false;
        return this;
    }
    rest() {
        this.options.rest = true;
        return this;
    }
    match(client, message, arg) {
        throw Error(`Cannot parse base type at position ${arg.index}`);
    }
    get string() {
        return `${this.options.required ? "<" : "["}${this.options.argName}:${this.options.typeName}${this.options.rest ? "..." : ""}${this.options.required ? ">" : "]"}`;
    }
}
exports.BaseType = BaseType;
