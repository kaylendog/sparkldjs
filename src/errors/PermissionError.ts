import { RoleResolvable } from "discord.js";

export class PermissionError extends Error {
	public recievedPermission: number;
	public requiredPermission: number | RoleResolvable[];
	public message: string;

	constructor(options: {
		recievedPermission: number;
		requiredPermission: number | RoleResolvable[];
		message: string;
	}) {
		super();
		this.recievedPermission = options.recievedPermission;
		this.requiredPermission = options.requiredPermission;
		this.message = options.message;
	}
}
