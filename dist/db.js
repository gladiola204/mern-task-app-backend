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
exports.findAndDeleteTodo = exports.findAndUpdateTodo = exports.createTodo = exports.getTodos = void 0;
const mongodb_1 = require("mongodb");
const client_1 = require("./client");
const collectionName = 'todos';
function getId(id) {
    return mongodb_1.ObjectId.isValid(id) ? new mongodb_1.ObjectId(id) : null;
}
function getCollection() {
    const db = (0, client_1.getDb)();
    return db.collection(collectionName);
}
function getTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = getCollection();
        return yield collection.find().toArray();
    });
}
exports.getTodos = getTodos;
function createTodo(name, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = getCollection();
        const doc = { name, done };
        const result = yield collection.insertOne(doc);
        const _id = result.insertedId;
        return Object.assign({ _id }, doc);
    });
}
exports.createTodo = createTodo;
function findAndUpdateTodo(id, update) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = getCollection();
        const result = yield collection.findOneAndUpdate({ _id: getId(id) }, update, { returnDocument: "after" });
        return result.value;
    });
}
exports.findAndUpdateTodo = findAndUpdateTodo;
function findAndDeleteTodo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = getCollection();
        const result = yield collection.findOneAndDelete({ _id: getId(id) });
        return result.value;
    });
}
exports.findAndDeleteTodo = findAndDeleteTodo;
