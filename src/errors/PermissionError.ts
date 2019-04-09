import { RoleResolvable } from "discord.js";

export class PermissionError extends Error {
	public receivedPermission: number;
	public requiredPermission: number | RoleResolvable[];
	public message: string;

	constructor(options: {
		receivedPermission: number;
		requiredPermission: number | RoleResolvable[];
		message: string;
	}) {
		super();
		this.receivedPermission = options.receivedPermission;
		this.requiredPermission = options.requiredPermission;
		this.message = options.message;
	}
}
