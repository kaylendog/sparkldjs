import { RoleResolvable } from "discord.js";
export declare class PermissionError extends Error {
    receivedPermission: number;
    requiredPermission: number | RoleResolvable[];
    message: string;
    constructor(options: {
        receivedPermission: number;
        requiredPermission: number | RoleResolvable[];
        message: string;
    });
}
