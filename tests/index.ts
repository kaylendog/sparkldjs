import * as tailjs from "../src";
import { BasePlugin } from "./BasePlugin";
import { Config, DEFAULT_CONFIG } from "./ConfigPlugin";

const client = new tailjs.TailClient({
	token: "NTEzODM3ODYyODMyMTc3MjAy.XKB_Jg.CTY_1TT7RrsDQwbNKlvrcJW2gP4",
})
	.addPlugin(BasePlugin)
	.useConfigPlugin((c) => new Config(c, { name: "uwu" }, DEFAULT_CONFIG));

client.start();
