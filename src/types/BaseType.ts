import { Message } from "discord.js";

import { SparklClient } from "../client/Client";

export interface BaseTypeOptions {
	typeName?: string;
	argName: string;
	required?: boolean;
	rest?: boolean;
}

export interface IBaseTypeArg {
	value: string;
	index: number;
}

export class BaseType {
	public options: BaseTypeOptions;
	constructor(options: BaseTypeOptions) {
		this.options = options;
	}

	public optional() {
		this.options.required = false;
		return this;
	}

	public rest() {
		this.options.rest = true;
		return this;
	}

	public match(client: SparklClient, message: Message, arg: IBaseTypeArg) {
		throw Error(`Cannot parse base type at position ${arg.index}`);
	}

	get string() {
		return `${this.options.required ? "<" : "["}${this.options.argName}:${
			this.options.typeName
		}${this.options.rest ? "..." : ""}${this.options.required ? ">" : "]"}`;
	}
}
