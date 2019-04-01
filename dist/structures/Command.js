"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const SyntaxParser_1 = require("./SyntaxParser");
class Command {
    constructor(client, options) {
        this.client = client;
        this.options = options;
        this.parser =
            options.syntaxParser ||
                new SyntaxParser_1.SyntaxParser({ args: this.options.syntax });
    }
    async execute(m, a) {
        if (this.options.guild) {
            if (m.guild) {
                if (m.guild.id !== this.options.guild) {
                    return;
                }
            }
        }
        const beginExecute = Date.now();
        this.client.logger.debug(`[cmd] [${this.options.group
            ? `${this.options.group} ${this.options.name}`
            : this.options.name}] Begin EXECUTE at ${new Date()}`);
        try {
            const parsedArguments = this.parser.parse(this.client, m, a);
            this.client.emit("command", {
                command: this.options.group
                    ? `${this.options.group} ${this.options.name}`
                    : this.options.name,
                m,
                timestamp: new Date(),
            });
            this.client.logger.log(`[cmd] [${this.options.group
                ? `${this.options.group} ${this.options.name}`
                : this.options.name}] ID: ${m.author.id} - ${Date.now() - beginExecute}ms`);
            await this.options.executable(m, parsedArguments);
            this.client.logger.debug(`[cmd] [${this.options.group
                ? `${this.options.group} ${this.options.name}`
                : this.options.name}] End EXECUTE at ${new Date()}`);
        }
        catch (err) {
            if (err instanceof SyntaxParseError_1.SyntaxParseError) {
                m.channel.send(err.message).catch((errx) => {
                    this.client.logger.error(err);
                    this.client.logger.error(errx);
                });
            }
            else {
                m.reply(":negative_squared_cross_mark: Internal error. Please contact the developer.");
                this.client.logger.error(err);
                console.error(err);
            }
        }
    }
}
exports.Command = Command;
/*
function syntaxMatch<S extends BaseType[], T extends keyof S>(s: any[]): s is S {
    return s.map((v, i) => ().indexOf(false) === -1 ? true : false;
}
*/
