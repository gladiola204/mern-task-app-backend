import { Request, Response } from "express";
import { getTodos, createTodo, findAndUpdateTodo, findAndDeleteTodo } from "./db";


function verifyName (req: Request, res: Response) {
    const { body } = req;
    if (!body || !body.hasOwnProperty('name')) {
        responseWithError(res, {error: 'Name is missing'});
        return;
    }
    else if (typeof body.name !== "string") {
        responseWithError(res, {error: 'Name should be a string'});
        return;
    }
    else if (body.name.trim() === '') {
        responseWithError(res, {error: 'Name should not be empty'});
        return;
    }
    return true;
}

function verifyDone (req: Request, res: Response) {
    const { body } = req;
    if (!body || !body.hasOwnProperty('done')) {
        responseWithError(res, {error: 'Done is missing'});
        return;
    }
    const { done } = req.body;
    if (typeof done !== "boolean") {
        responseWithError(res, {error: 'Done should be a boolean'});
        return;
    }
    return { done };
}

function responseWithError(res: Response, error: object): void {
    res.status(400);
    res.json(error);
}

export async function list(req: Request, res: Response) {
    const todos = await getTodos();
    res.status(200);
    res.json(todos);
};

export async function add(req: Request, res: Response){
    const { body } = req;
 
    if(!verifyName(req, res)) {
        return;
    };

    const result = await createTodo(body.name, false);
    res.status(200);
    res.json(result);
};

export async function toggle(req: Request, res: Response) {
    const cleanDone = verifyDone(req, res);
    if(!cleanDone) {
        return;
    }
    
    const todo = await findAndUpdateTodo(req.params.id, { $set: { done: cleanDone.done } });
    if(todo === null) {
        responseWithError(res, {error: 'ID is not found'});
        return;
    }

    res.status(200);
    res.json(todo);
};

export async function change(req: Request, res: Response) {
    
    if(!verifyName(req, res)) {
        return;
    };
    
    const { name } = req.body;
    const todo = await findAndUpdateTodo(req.params.id, { $set: { name } });
    if(todo === null) {
        responseWithError(res, {error: 'ID is not found'});
        return;
    }

    res.status(200);
    res.json(todo);
};

export async function deleteTask(req: Request, res: Response) {
    const todo = await findAndDeleteTodo(req.params.id);
    if(todo === null) {
        responseWithError(res, {error: 'ID is not found'});
        return;
    }
    res.status(200);
    res.json(todo);
}