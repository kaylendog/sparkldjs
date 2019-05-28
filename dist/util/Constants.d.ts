export declare const EMOTES: {
    NO: string;
    YES: string;
};
export declare const VERSION = "0.5.0";
export declare const DEFAULT_OPTIONS: {
    loggerDebugLevel: number;
    name: string;
};
export declare const DEFAULT_DJS_OPTIONS: {
    apiRequestMethod: string;
    shardId: number;
    shardCount: number;
    messageCacheMaxSize: number;
    messageCacheLifetime: number;
    messageSweepInterval: number;
    fetchAllMembers: boolean;
    disableEveryone: boolean;
    sync: boolean;
    restWsBridgeTimeout: number;
    disabledEvents: never[];
    restTimeOffset: number;
    ws: {
        large_threshold: number;
        compress: boolean;
        properties: {
            $os: string;
            $browser: string;
            $device: string;
            $referrer: string;
            $referring_domain: string;
        };
        version: number;
    };
    http: {
        version: number;
        host: string;
        cdn: string;
    };
};
