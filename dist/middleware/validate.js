"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const errors_1 = require("@/lib/errors");
function validateBody(schema) {
    return (req, _res, next) => {
        try {
            req.body = schema(req.body);
            next();
        }
        catch (error) {
            if (error instanceof errors_1.BadRequestError) {
                next(error);
            }
            else {
                next(new errors_1.BadRequestError("Invalid request body"));
            }
        }
    };
}
