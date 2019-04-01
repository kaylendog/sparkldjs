import { TailClient } from "../client/Client";
export declare class Logger {
    private client;
    constructor(client: TailClient);
    log(...m: any[]): void;
    debug(m: any, level?: "quiet" | "verbose"): void;
    success(m: any): void;
    warn(m: any): void;
    error(m: any): void;
    private format;
}
