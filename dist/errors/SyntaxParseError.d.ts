import { BaseType } from "../types/BaseType";
export declare class SyntaxParseError extends Error {
    type: SyntaxParseErrorType;
    expectedArgument?: BaseType;
    recievedArgument?: {
        index: number;
        value: any;
    };
    message: string;
    constructor(options: {
        type: SyntaxParseErrorType;
        recievedArgument?: {
            index: number;
            value: any;
        };
        message: string;
        expectedArgument?: BaseType;
    });
}
export declare type SyntaxParseErrorType = "NOT_ENOUGH_ARGS" | "TOO_MANY_ARGS" | "PARSE_FAILED";
