import { Message } from "discord.js";
import * as util from "util";

import { TailClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";

export interface IStringTypeOptions extends BaseTypeOptions {
	maxLength?: number;
	minLength?: number;
}

export class StringType extends BaseType {
	public options: IStringTypeOptions;
	constructor(typeOptions: IStringTypeOptions) {
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
	public match(client: TailClient, message: Message, arg: IBaseTypeArg) {
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
