import { Message } from "discord.js";
import { TailClient } from "../client/Client";
import { BaseType, BaseTypeOptions, IBaseTypeArg } from "./BaseType";
interface UnionTypeOptions extends BaseTypeOptions {
    types: BaseType[];
}
/**
 * Type for combining types - just a bit of typeception
 */
export declare class UnionType extends BaseType {
    options: UnionTypeOptions;
    constructor(opts: UnionTypeOptions);
    match(client: TailClient, message: Message, arg: IBaseTypeArg): void;
    readonly string: string;
}
export {};
