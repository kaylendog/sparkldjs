import chalk from "chalk";
import moment from "moment";

import { TailClient } from "../client/Client";

export class Logger {
	private client: TailClient;
	constructor(client: TailClient) {
		this.client = client;
	}

	public log(...m: any[]) {
		return this.format(chalk.cyan("info"), ...m);
	}
	public debug(m: any, level: "quiet" | "verbose" = "quiet") {
		if (
			this.client.options.loggerDebugLevel &&
			(this.client.options.loggerDebugLevel === level ||
				this.client.options.loggerDebugLevel === "verbose")
		) {
			return this.format(chalk.blue("debug"), m);
		}
	}

	public success(m: any) {
		return this.format(chalk.green.bold("SUCCESS"), m);
	}

	public warn(m: any) {
		return this.format(chalk.yellow.bold("WARNING"), m);
	}
	public error(m: any) {
		return this.format(chalk.red.bold("ERROR"), m);
	}

	private format(...args: any[]) {
		return console.log(
			`${chalk.gray("[")}${chalk.white(
				moment().format("HH:mm:ss"),
			)}${chalk.gray("]")}`,
			...args,
		);
	}
}
