import { Message } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType } from "../types/BaseType";
export interface ParserOptions {
    args?: string | string[] | BaseType[];
    errorMessages?: {
        NOT_ENOUGH_ARGS: (index: number, expectedArgument: BaseType) => string;
        TOO_MANY_ARGS: (args: string) => string;
        PARSED_FAILED: (expectedArgument: BaseType, recievedArgument: any) => string;
    };
}
export declare const DEFAULT_SYNTAX_ERRORS: {
    NOT_ENOUGH_ARGS: (index: number, arg: BaseType) => string;
    TOO_MANY_ARGS: (args: string) => string;
};
export declare class SyntaxParser {
    private options;
    private syntax;
    constructor(options: ParserOptions);
    parse(client: TailClient, message: Message, args?: string[]): any[];
}
