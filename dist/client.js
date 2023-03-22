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
exports.drop = exports.getDb = exports.disconnect = exports.connect = void 0;
const mongodb_1 = require("mongodb");
const url = 'mongodb://localhost:27017';
const dbName = process.env.DBNAME || 'test-todos';
let client;
function resetClient() {
    client = null;
}
function getClient() {
    if (client == null) {
        throw new Error("Not connected to the database");
    }
    else {
        return client;
    }
}
function connect() {
    client = new mongodb_1.MongoClient(url);
}
exports.connect = connect;
function disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = getClient();
        yield client.close();
        resetClient();
    });
}
exports.disconnect = disconnect;
function getDb() {
    const client = getClient();
    return client.db(dbName);
}
exports.getDb = getDb;
function drop() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = getClient();
        const db = client.db(dbName);
        yield db.dropDatabase();
    });
}
exports.drop = drop;
