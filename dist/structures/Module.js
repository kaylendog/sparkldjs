"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    constructor(client) {
        this.client = client;
    }
}
exports.Module = Module;
function module(name, onStart) {
    return (client) => {
        const m = new Module(client);
        m.moduleName = name;
        m.start = onStart;
        return m;
    };
}
exports.module = module;
