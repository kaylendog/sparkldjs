import { default as chalk } from "chalk";
import * as winston from "winston";

export const rainbow = (str: string) => {
	return str
		.trim()
		.split("")
		.reduce((comb, curr, i) => {
			const color = i % 6;
			switch (color) {
				case 0:
					return comb + chalk.red(curr);

				case 1:
					return comb + chalk.yellow(curr);

				case 2:
					return comb + chalk.green(curr);

				case 3:
					return comb + chalk.cyan(curr);
				case 4:
					return comb + chalk.blue(curr);
				case 5:
					return comb + chalk.magenta(curr);
				default:
					return comb + curr;
			}
		}, "");
};

export const createLogger = (debugOption: 0 | 1 | 2) => {
	return winston.createLogger({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.timestamp(),
			winston.format.simple(),
			winston.format.printf((info) => {
				const { timestamp, level, message } = info;

				const ts = timestamp.slice(0, 19).split("T")[1];
				return `${chalk.gray(ts)} ${chalk.white(
					"|",
				)} ${level} ${chalk.white("|")} ${message}`;
			}),
		),
		transports: new winston.transports.Console({
			level: debugOption === 1 ? "debug" : "info",
		}),
	});
};
