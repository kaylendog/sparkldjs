import { RichEmbed, RichEmbedOptions } from "discord.js";
import { SparklClient } from "../client/Client";
export declare class Embed extends RichEmbed {
    client: SparklClient;
    constructor(client: SparklClient, opts?: RichEmbedOptions);
}
