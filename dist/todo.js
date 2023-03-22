"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.change = exports.toggle = exports.add = exports.list = void 0;
const db_1 = require("./db");
function verifyName(req, res) {
    const { body } = req;
    if (!body || !body.hasOwnProperty('name')) {
        responseWithError(res, { error: 'Name is missing' });
        return;
    }
    else if (typeof body.name !== "string") {
        responseWithError(res, { error: 'Name should be a string' });
        return;
    }
    else if (body.name.trim() === '') {
        responseWithError(res, { error: 'Name should not be empty' });
        return;
    }
    return true;
}
function verifyDone(req, res) {
    const { body } = req;
    if (!body || !body.hasOwnProperty('done')) {
        responseWithError(res, { error: 'Done is missing' });
        return;
    }
    const { done } = req.body;
    if (typeof done !== "boolean") {
        responseWithError(res, { error: 'Done should be a boolean' });
        return;
    }
    return { done };
}
function responseWithError(res, error) {
    res.status(400);
    res.json(error);
}
function list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const todos = yield (0, db_1.getTodos)();
        res.status(200);
        res.json(todos);
    });
}
exports.list = list;
;
function add(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body } = req;
        if (!verifyName(req, res)) {
            return;
        }
        ;
        const result = yield (0, db_1.createTodo)(body.name, false);
        res.status(200);
        res.json(result);
    });
}
exports.add = add;
;
function toggle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanDone = verifyDone(req, res);
        if (!cleanDone) {
            return;
        }
        const todo = yield (0, db_1.findAndUpdateTodo)(req.params.id, { $set: { done: cleanDone.done } });
        if (todo === null) {
            responseWithError(res, { error: 'ID is not found' });
            return;
        }
        res.status(200);
        res.json(todo);
    });
}
exports.toggle = toggle;
;
function change(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!verifyName(req, res)) {
            return;
        }
        ;
        const { name } = req.body;
        const todo = yield (0, db_1.findAndUpdateTodo)(req.params.id, { $set: { name } });
        if (todo === null) {
            responseWithError(res, { error: 'ID is not found' });
            return;
        }
        res.status(200);
        res.json(todo);
    });
}
exports.change = change;
;
function deleteTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const todo = yield (0, db_1.findAndDeleteTodo)(req.params.id);
        if (todo === null) {
            responseWithError(res, { error: 'ID is not found' });
            return;
        }
        res.status(200);
        res.json(todo);
    });
}
exports.deleteTask = deleteTask;
