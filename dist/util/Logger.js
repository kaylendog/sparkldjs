"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class Logger {
    constructor(client) {
        this.client = client;
    }
    log(...m) {
        return this.format(chalk_1.default.cyan("info"), ...m);
    }
    debug(m, level = "quiet") {
        if (this.client.options.loggerDebugLevel &&
            (this.client.options.loggerDebugLevel === level ||
                this.client.options.loggerDebugLevel === "verbose")) {
            return this.format(chalk_1.default.blue("debug"), m);
        }
    }
    success(m) {
        return this.format(chalk_1.default.green.bold("SUCCESS"), m);
    }
    warn(m) {
        return this.format(chalk_1.default.yellow.bold("WARNING"), m);
    }
    error(m) {
        return this.format(chalk_1.default.red.bold("ERROR"), m);
    }
    format(...args) {
        return console.log(`${chalk_1.default.gray("[")}${chalk_1.default.white(moment_1.default().format("HH:mm:ss"))}${chalk_1.default.gray("]")}`, ...args);
    }
}
exports.Logger = Logger;
