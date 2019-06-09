"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const SyntaxParser_1 = require("./SyntaxParser");
/**
 * Class enabling users to directly interact with the client from Discord
 */
class Command {
    constructor(options) {
        this.options = options;
        this.parser =
            options.syntaxParser ||
                new SyntaxParser_1.SyntaxParser({ args: this.options.syntax });
    }
    /**
     *
     * @param {SparklClient} client The client object
     * @param {Message} message The message triggering the command
     * @param {string[]} args Arguments parsed to the command
     */
    async execute(client, message, args) {
        if (this.options.guild) {
            if (message.guild) {
                if (message.guild.id !== this.options.guild) {
                    return;
                }
            }
            else {
                return;
            }
        }
        if (!message.guild) {
            return;
        }
        const beginExecute = Date.now();
        client.logger.debug(`[cmd] [${this.options.group
            ? `${this.options.group} ${this.options.name}`
            : this.options.name}] Begin EXECUTE at ${new Date()}`);
        try {
            const parsedArguments = this.parser.parse(client, message, args);
            client.emit("command", {
                command: this.options.group
                    ? `${this.options.group} ${this.options.name}`
                    : this.options.name,
                message,
                timestamp: new Date(),
            });
            client.logger.info(`[cmd] [${this.options.group
                ? `${this.options.group.join(".")}.${this.options.name}`
                : this.options.name}] ID: ${message.author.id} - ${Date.now() - beginExecute}ms`);
            await this.options.executable(client, message, parsedArguments);
            client.logger.debug(`[cmd] [${this.options.group
                ? `${this.options.group} ${this.options.name}`
                : this.options.name}] End EXECUTE at ${new Date()}`);
        }
        catch (err) {
            if (err instanceof SyntaxParseError_1.SyntaxParseError) {
                if (client.options.syntaxErrorHandler) {
                    return client.options.syntaxErrorHandler(message, err);
                }
                message.channel.send(err.message).catch((errx) => {
                    client.logger.error(err);
                    client.logger.error(errx);
                });
            }
            else {
                message.reply(":negative_squared_cross_mark: Internal error. Please contact the developer.");
                client.logger.error(err);
                console.error(err);
            }
        }
    }
    hasAlias(s) {
        if (this.options.aliases) {
            if (this.options.aliases.indexOf(s) !== -1) {
                return true;
            }
        }
        return false;
    }
}
exports.Command = Command;
