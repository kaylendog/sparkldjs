"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const winston = __importStar(require("winston"));
exports.rainbow = (str) => {
    return str
        .trim()
        .split("")
        .reduce((comb, curr, i) => {
        const color = i % 6;
        switch (color) {
            case 0:
                return comb + chalk_1.default.red(curr);
            case 1:
                return comb + chalk_1.default.yellow(curr);
            case 2:
                return comb + chalk_1.default.green(curr);
            case 3:
                return comb + chalk_1.default.cyan(curr);
            case 4:
                return comb + chalk_1.default.blue(curr);
            case 5:
                return comb + chalk_1.default.magenta(curr);
            default:
                return comb + curr;
        }
    }, "");
};
exports.createLogger = (debugOption) => {
    return winston.createLogger({
        format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.simple(), winston.format.printf((info) => {
            const { timestamp, level, message } = info;
            const ts = timestamp.slice(0, 19).split("T")[1];
            return `${chalk_1.default.gray(ts)} ${chalk_1.default.white("|")} ${level} ${chalk_1.default.white("|")} ${message}`;
        })),
        transports: new winston.transports.Console({
            level: debugOption === 1 ? "debug" : "info",
        }),
    });
};
