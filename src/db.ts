import { ObjectId } from "mongodb";
import { getDb } from "./client";

const collectionName = 'todos';

function getId(id: string | ObjectId) {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function getCollection() {
    const db = getDb();
    return db.collection(collectionName);
}

export async function getTodos() {
    const collection = getCollection();

    return await collection.find().toArray();
}

export async function createTodo(name: string, done: boolean) {
    const collection = getCollection();
    const doc = { name, done };
    const result = await collection.insertOne(doc);
    const _id = result.insertedId;
    return { _id, ...doc };
}

export async function findAndUpdateTodo(id: string | ObjectId, update: any) {
    const collection = getCollection();

    const result = await collection.findOneAndUpdate(
        { _id: getId(id) },
        update,
        { returnDocument: "after" },
    );

    return result.value;
}

export async function findAndDeleteTodo(id: string | ObjectId) {
    const collection = getCollection();

    const result = await collection.findOneAndDelete(
        {_id: getId(id) }
    );
    return result.value;
}