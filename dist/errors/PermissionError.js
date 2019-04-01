"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionError extends Error {
    constructor(options) {
        super();
        this.recievedPermission = options.recievedPermission;
        this.requiredPermission = options.requiredPermission;
        this.message = options.message;
    }
}
exports.PermissionError = PermissionError;
