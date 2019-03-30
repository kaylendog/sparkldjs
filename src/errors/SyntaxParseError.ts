import { BaseType } from "../types/BaseType";

export class SyntaxParseError extends Error {
	public type: SyntaxParseErrorType;
	public expectedArgument?: BaseType;
	public recievedArgument?: {
		index: number;
		value: any;
	};
	public message: string;

	constructor(options: {
		type: SyntaxParseErrorType;
		recievedArgument?: {
			index: number;
			value: any;
		};
		message: string;
		expectedArgument?: BaseType;
	}) {
		super();
		this.type = options.type;
		this.expectedArgument = options.expectedArgument;
		this.recievedArgument = options.recievedArgument;
		this.message = options.message;
	}
}

export type SyntaxParseErrorType =
	| "NOT_ENOUGH_ARGS"
	| "TOO_MANY_ARGS"
	| "PARSE_FAILED";
