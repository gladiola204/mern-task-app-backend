"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const todo_1 = require("./todo");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded());
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', "https://mern-task-app-68dr.onrender.com"],
}));
exports.app.set('x-powered-by', false);
//  /get all
exports.app.get('/', todo_1.list);
//  /add
exports.app.post('/', todo_1.add);
//  /toggle
exports.app.post('/toggle/:id', todo_1.toggle);
//  /change
exports.app.put('/:id', todo_1.change);
//  /delete
exports.app.delete('/:id', todo_1.deleteTask);
exports.app.get('*', (req, res) => {
    res.status(404).send('Not found');
});
exports.app.use((error, req, res, next) => {
    console.log(error.stack);
    res.status(500).send('We have encountered error and we were notified about it. We will try to fix it as soon as possible!');
});
