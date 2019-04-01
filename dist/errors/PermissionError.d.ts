import { RoleResolvable } from "discord.js";
export declare class PermissionError extends Error {
    recievedPermission: number;
    requiredPermission: number | RoleResolvable[];
    message: string;
    constructor(options: {
        recievedPermission: number;
        requiredPermission: number | RoleResolvable[];
        message: string;
    });
}
