"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionError extends Error {
    constructor(options) {
        super();
        this.receivedPermission = options.receivedPermission;
        this.requiredPermission = options.requiredPermission;
        this.message = options.message;
    }
}
exports.PermissionError = PermissionError;
