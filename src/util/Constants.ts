export const EMOTES = {
	NO: ":negative_squared_cross_mark: ",
	YES: ":white_check_mark:",
};

export const VERSION = "0.5.0";

export const DEFAULT_OPTIONS = {
	loggerDebugLevel: 0,
	name: "sparkldjs",
};

export const DEFAULT_DJS_OPTIONS = {
	apiRequestMethod: "sequential",
	shardId: 0,
	shardCount: 0,
	messageCacheMaxSize: 200,
	messageCacheLifetime: 0,
	messageSweepInterval: 0,
	fetchAllMembers: false,
	disableEveryone: false,
	sync: false,
	restWsBridgeTimeout: 5000,
	disabledEvents: [],
	restTimeOffset: 500,

	ws: {
		large_threshold: 250,
		compress: require("os").platform() !== "browser",
		properties: {
			$os: process ? process.platform : "discord.js",
			$browser: "discord.js",
			$device: "discord.js",
			$referrer: "",
			$referring_domain: "",
		},
		version: 6,
	},

	http: {
		version: 7,
		host: "https://discordapp.com",
		cdn: "https://cdn.discordapp.com",
	},
};


