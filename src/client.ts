import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';
const dbName = process.env.DBNAME || 'test-todos';

let client: MongoClient | any;

function resetClient() {
    client = null;
}

function getClient() {
    if (client == null) {
        throw new Error ("Not connected to the database");
    } else {
        return client;
    }
}

export function connect() {
    client = new MongoClient(url);
}

export async function disconnect() {
    const client = getClient();
    await client.close();
    resetClient();
}

export function getDb() {
    const client = getClient();
    return client.db(dbName);
}

export async function drop() {
    const client = getClient();
    const db = client.db(dbName);
    await db.dropDatabase();
}       