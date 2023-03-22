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
const todo_1 = require("./todo");
const client_1 = require("./client");
const db_1 = require("./db");
let req;
let res;
let next;
let responseJson;
let responseStatus;
function expectStatus(status) {
    expect(responseStatus).toEqual(status);
}
function expectResponse(json) {
    expect(responseJson).toEqual(json);
}
beforeEach(() => {
    req = {
        params: {},
    };
    res = {
        json: jest.fn().mockImplementation((result) => {
            responseJson = result;
        }),
        status: jest.fn().mockImplementation((result) => {
            responseStatus = result;
        }),
    };
    next = jest.fn();
});
beforeAll(client_1.connect);
beforeEach(client_1.drop);
afterAll(client_1.disconnect);
describe('list', () => {
    it('works', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, todo_1.list)(req, res);
        const todos = yield (0, db_1.getTodos)();
        expectStatus(200);
        expectResponse(todos);
    }));
});
describe('add', () => {
    it('works', () => __awaiter(void 0, void 0, void 0, function* () {
        const { length } = yield (0, db_1.getTodos)();
        req.body = {
            name: 'Lunch',
        };
        yield (0, todo_1.add)(req, res);
        const todos = yield (0, db_1.getTodos)();
        expectStatus(200);
        expectResponse(todos[todos.length - 1]);
        expect(todos).toHaveLength(length + 1);
        expect(todos[todos.length - 1]).toMatchObject({
            name: 'Lunch',
            done: false,
        });
    }));
    it('handles missing body', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, todo_1.add)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name is missing' });
    }));
    it('handles missing name in the body', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        yield (0, todo_1.add)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name is missing' });
    }));
    it('handles an empty name', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { name: '' };
        yield (0, todo_1.add)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name should not be empty' });
    }));
    it('handles an empty name (after trimming)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { name: '     ' };
        yield (0, todo_1.add)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name should not be empty' });
    }));
    it('handles wrong name type', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { name: 69 };
        yield (0, todo_1.add)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name should be a string' });
    }));
});
describe('toggle', () => {
    it('works with toggling to true', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'bububu';
        const { _id } = yield (0, db_1.createTodo)(name, false);
        const { length } = yield (0, db_1.getTodos)();
        req.params = { id: _id };
        req.body = { done: true };
        yield (0, todo_1.toggle)(req, res);
        const todos = yield (0, db_1.getTodos)();
        const todoAfterToggling = todos.find(eachTodo => eachTodo._id.equals(_id)) || { done: 'Not found' };
        expectStatus(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(todos).toHaveLength(length);
        expectResponse(todoAfterToggling);
        expect(todoAfterToggling.done).toEqual(true);
    }));
    it('works with toggling to false', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'bububu';
        const { _id } = yield (0, db_1.createTodo)(name, true);
        const { length } = yield (0, db_1.getTodos)();
        req.params = { id: _id };
        req.body = { done: false };
        yield (0, todo_1.toggle)(req, res);
        const todos = yield (0, db_1.getTodos)();
        const todoAfterToggling = todos.find(eachTodo => eachTodo._id.equals(_id)) || { done: 'Not found' };
        expectStatus(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expectResponse(todoAfterToggling);
        expect(todos).toHaveLength(length);
        expect(todoAfterToggling.done).toEqual(false);
    }));
    it('handles wrong ID', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: 'whatever' };
        req.body = { done: true };
        yield (0, todo_1.toggle)(req, res);
        expectStatus(400);
        expectResponse({ error: 'ID is not found' });
    }));
    it('handles missing body', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, todo_1.toggle)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Done is missing' });
    }));
    it('handles missing done in the body', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        yield (0, todo_1.toggle)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Done is missing' });
    }));
    it('handles wrong done type', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { done: 69 };
        yield (0, todo_1.toggle)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Done should be a boolean' });
    }));
});
describe('change', () => {
    it('works', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'bububu';
        const nextName = 'Chlup chlup';
        const { _id } = yield (0, db_1.createTodo)(name, false);
        const { length } = yield (0, db_1.getTodos)();
        req.params = { id: _id };
        req.body = { name: nextName };
        yield (0, todo_1.change)(req, res);
        const todos = yield (0, db_1.getTodos)();
        //const todo = todos.find(todo => todo._id.equals(_id));
        expect(res.json).toHaveBeenCalledTimes(1);
        expectResponse({ name: nextName, _id, done: false });
        expect(todos).toHaveLength(length);
    }));
    it('handles missing body', () => __awaiter(void 0, void 0, void 0, function* () {
        const nextName = 'Wrongii';
        req.params = { id: 'whatever' };
        req.body = { name: nextName };
        yield (0, todo_1.change)(req, res);
        expectStatus(400);
        expectResponse({ error: 'ID is not found' });
    }));
    it('handles missing name in the body', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        yield (0, todo_1.change)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name is missing' });
    }));
    it('handles an empty name', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { name: '' };
        yield (0, todo_1.change)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name should not be empty' });
    }));
    it('handles an empty name (after trimming)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { name: '     ' };
        yield (0, todo_1.change)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name should not be empty' });
    }));
    it('handles wrong name type', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { name: 69 };
        yield (0, todo_1.change)(req, res);
        expectStatus(400);
        expectResponse({ error: 'Name should be a string' });
    }));
});
describe('delete', () => {
    it('works', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'bububu';
        const todo = yield (0, db_1.createTodo)(name, false);
        const { length } = yield (0, db_1.getTodos)();
        req.params = { id: todo._id };
        yield (0, todo_1.deleteTask)(req, res);
        const todos = yield (0, db_1.getTodos)();
        expect(res.json).toHaveBeenCalledTimes(1);
        expectResponse(todo);
        expect(todos).toHaveLength(length - 1);
    }));
    it('handles missing body', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: 'whatever' };
        yield (0, todo_1.deleteTask)(req, res);
        expectStatus(400);
        expectResponse({ error: 'ID is not found' });
    }));
});
