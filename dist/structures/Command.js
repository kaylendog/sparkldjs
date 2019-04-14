"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxParseError_1 = require("../errors/SyntaxParseError");
const SyntaxParser_1 = require("./SyntaxParser");
class Command {
    constructor(options) {
        this.options = options;
        this.parser =
            options.syntaxParser ||
                new SyntaxParser_1.SyntaxParser({ args: this.options.syntax });
    }
    async execute(c, m, a) {
        if (this.options.guild) {
            if (m.guild) {
                if (m.guild.id !== this.options.guild) {
                    return;
                }
            }
            else {
                return;
            }
        }
        if (!m.guild) {
            return;
        }
        const beginExecute = Date.now();
        c.logger.debug(`[cmd] [${this.options.group
            ? `${this.options.group} ${this.options.name}`
            : this.options.name}] Begin EXECUTE at ${new Date()}`);
        try {
            const parsedArguments = this.parser.parse(c, m, a);
            c.emit("command", {
                command: this.options.group
                    ? `${this.options.group} ${this.options.name}`
                    : this.options.name,
                m,
                timestamp: new Date(),
            });
            c.logger.log(`[cmd] [${this.options.group
                ? `${this.options.group.join(".")}.${this.options.name}`
                : this.options.name}] ID: ${m.author.id} - ${Date.now() - beginExecute}ms`);
            await this.options.executable(c, m, parsedArguments);
            c.logger.debug(`[cmd] [${this.options.group
                ? `${this.options.group} ${this.options.name}`
                : this.options.name}] End EXECUTE at ${new Date()}`);
        }
        catch (err) {
            if (err instanceof SyntaxParseError_1.SyntaxParseError) {
                if (c.options.syntaxErrorHandler) {
                    return c.options.syntaxErrorHandler(m, err);
                }
                m.channel.send(err.message).catch((errx) => {
                    c.logger.error(err);
                    c.logger.error(errx);
                });
            }
            else {
                m.reply(":negative_squared_cross_mark: Internal error. Please contact the developer.");
                c.logger.error(err);
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
/*
function syntaxMatch<S extends BaseType[], T extends keyof S>(s: any[]): s is S {
    return s.map((v, i) => ().indexOf(false) === -1 ? true : false;
}
*/
