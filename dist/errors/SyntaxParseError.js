"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SyntaxParseError extends Error {
    constructor(options) {
        super();
        this.type = options.type;
        this.expectedArgument = options.expectedArgument;
        this.recievedArgument = options.recievedArgument;
        this.message = options.message;
    }
}
exports.SyntaxParseError = SyntaxParseError;
