"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = void 0;
exports.authenticated = async (req, res, next) => {
    if (req.headers.authorization !== process.env.SECRET)
        return res.sendStatus(401);
    next();
};
