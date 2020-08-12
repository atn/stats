"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const monk_1 = __importDefault(require("monk"));
const db = monk_1.default(process.env.MONGO_URI);
const stats = db.get('stats');
const mw_1 = require("./mw");
const app = express_1.default();
app.get('/', async (req, res) => {
    const data = await stats.findOne({ id: 1 });
    res.json({
        commands: data.commands
    });
});
app.post('/new/command', mw_1.authenticated, async (req, res) => {
    try {
        const data = await stats.findOne({ id: 1 });
        console.log(data.commands++);
        stats.findOneAndUpdate({ id: 1 }, { $set: { commands: data.commands++ } });
        res.sendStatus(200);
    }
    catch (err) {
        res.send(err).status(400);
    }
});
app.use((req, res, next) => {
    res.send('i think you\'re lost buddy, go somewhere else.');
});
app.listen(process.env.PORT || 80, () => {
    console.log(`Austin Stats API Up`);
});
exports.default = app;
