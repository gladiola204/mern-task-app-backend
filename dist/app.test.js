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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("./app");
const client_1 = require("./client");
beforeAll(client_1.connect);
beforeEach(client_1.drop);
afterAll(client_1.disconnect);
it('works', () => __awaiter(void 0, void 0, void 0, function* () {
    const { status, header } = yield (0, supertest_1.default)(app_1.app).get('/');
    expect(status).toEqual(200);
    expect(header['content-type']).toEqual('application/json; charset=utf-8');
}));
it('updates a todo', () => __awaiter(void 0, void 0, void 0, function* () {
    const name = "Supper";
    const createResponse = yield (0, supertest_1.default)(app_1.app).post('/').send({ name }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
    expect(createResponse.status).toEqual(200);
    expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8');
    const createdTodo = JSON.parse(createResponse.text);
    expect(createdTodo).toMatchObject({ name, done: false });
    const { _id } = createdTodo;
    const nextName = "Dinner";
    const updateResponse = yield (0, supertest_1.default)(app_1.app).put(`/${_id}`).send({ name: nextName });
    expect(updateResponse.status).toEqual(200);
    expect(updateResponse.header['content-type']).toEqual('application/json; charset=utf-8');
    const changedTodo = JSON.parse(updateResponse.text);
    expect(changedTodo).toMatchObject({ name: nextName, done: false });
}));
it('deletes a todo', () => __awaiter(void 0, void 0, void 0, function* () {
    const name = "Supper";
    const createResponse = yield (0, supertest_1.default)(app_1.app).post('/').send({ name }).set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
    expect(createResponse.status).toEqual(200);
    expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8');
    const createdTodo = JSON.parse(createResponse.text);
    expect(createdTodo).toMatchObject({ name, done: false });
    const { _id } = createdTodo;
    const updateResponse = yield (0, supertest_1.default)(app_1.app).delete(`/${_id}`).send();
    expect(updateResponse.status).toEqual(200);
    expect(updateResponse.header['content-type']).toEqual('application/json; charset=utf-8');
    const changedTodo = JSON.parse(updateResponse.text);
    expect(changedTodo).toMatchObject({ name, done: false });
}));
it('returns an error when creating a todo without a body', () => __awaiter(void 0, void 0, void 0, function* () {
    const { status, header } = yield (0, supertest_1.default)(app_1.app).post('/');
    expect(status).toEqual(400);
}));
it('handles pages that are not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const { status, text } = yield (0, supertest_1.default)(app_1.app).get('/whatever');
    expect(status).toEqual(404);
    expect(text).toEqual("Not found");
}));
