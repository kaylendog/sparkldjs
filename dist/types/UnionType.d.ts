import { Message } from "discord.js";
import { SparklClient } from "../client/Client";
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
    match(client: SparklClient, message: Message, arg: IBaseTypeArg): any;
    readonly string: string;
}
export {};
