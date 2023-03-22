import { NextFunction, Request, Response } from "express";
import { add, change, deleteTask, list, toggle } from "./todo";
import { connect, drop, disconnect } from "./client";
import { createTodo, getTodos } from "./db";
import { ObjectId } from "mongodb";

let req: Partial<Request>;
let res: Partial<Response>;
let next: Partial<NextFunction>;
let responseJson: string;
let responseStatus: number;

interface todoObject {
    _id: ObjectId,
    name: string,
    done: boolean,
}

function expectStatus(status: number) {
    expect(responseStatus).toEqual(status);
}

function expectResponse(json: object | todoObject | Array<object> | string) {
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
})

beforeAll(connect);
beforeEach(drop);
afterAll(disconnect);

describe('list', () => {
    it('works', async() => {
        await list(req as Request, res as Response);

        const todos = await getTodos();
        expectStatus(200);
        expectResponse(todos);
    })
});

describe('add', () => {
    it('works', async() => {
        const { length } = await getTodos();
        req.body = {
            name: 'Lunch',
        }
        await add(req as Request, res as Response);

        const todos = await getTodos();

        expectStatus(200);
        expectResponse(todos[todos.length - 1]);
        expect(todos).toHaveLength(length + 1);
        expect(todos[todos.length - 1]).toMatchObject({
            name: 'Lunch',
            done: false,
        });
    });
    it('handles missing body', async() => {
        await add(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name is missing'})

    });
    it('handles missing name in the body', async() => {
        req.body = {};
        await add(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name is missing'})
    });
    it('handles an empty name', async() => {
        req.body = {name: ''};
        await add(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name should not be empty'});
    });
    it('handles an empty name (after trimming)', async() => {
        req.body = {name: '     '};
        await add(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name should not be empty'});
    });
    it('handles wrong name type', async() => {
        req.body = { name: 69 };
        await add(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name should be a string'});
    });

});

describe('toggle', () => {
    it('works with toggling to true', async() => {
        const name = 'bububu';
        const { _id } = await createTodo(name, false);
        const { length } = await getTodos();
        req.params = { id: _id };
        req.body = { done: true };
        
        await toggle(req as Request, res as Response);

        const todos: Array<todoObject> = await getTodos();
        const todoAfterToggling = todos.find(eachTodo => eachTodo._id.equals(_id)) || { done: 'Not found' };
        
        expectStatus(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(todos).toHaveLength(length);
        expectResponse(todoAfterToggling);
        expect(todoAfterToggling.done).toEqual(true);
    });
    it('works with toggling to false', async() => {
        const name = 'bububu';
        const { _id } = await createTodo(name, true);
        const { length } = await getTodos();
        req.params = { id: _id };
        req.body = { done: false };
        
        await toggle(req as Request, res as Response);

        const todos: Array<todoObject> = await getTodos();
        const todoAfterToggling = todos.find(eachTodo => eachTodo._id.equals(_id)) || { done: 'Not found' };
    
        expectStatus(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expectResponse(todoAfterToggling);
        expect(todos).toHaveLength(length);
        expect(todoAfterToggling.done).toEqual(false);
    });
    it('handles wrong ID', async() => {
        req.params = { id: 'whatever' };
        req.body = { done: true };
        await toggle(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'ID is not found'})

    });
    it('handles missing body', async() => {
        await toggle(req as Request, res as Response);
        
        expectStatus(400);
        expectResponse({error: 'Done is missing'})

    });
    it('handles missing done in the body', async() => {
        req.body = {};
        await toggle(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Done is missing'})
    });
    it('handles wrong done type', async() => {
        req.body = { done: 69 };
        await toggle(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Done should be a boolean'});
    });
});

describe('change', () => {
    it('works', async() => {
        const name = 'bububu';
        const nextName = 'Chlup chlup';
        const { _id } = await createTodo(name, false);
        const { length } = await getTodos();
        req.params = { id: _id };
        req.body = { name: nextName };

        await change(req as Request, res as Response);

        const todos: Array<todoObject> = await getTodos();
        //const todo = todos.find(todo => todo._id.equals(_id));


        expect(res.json).toHaveBeenCalledTimes(1);
        expectResponse({name: nextName, _id, done: false});
        expect(todos).toHaveLength(length);
    });
    it('handles missing body', async() => {
        const nextName = 'Wrongii';
        req.params = { id: 'whatever' };
        req.body = { name: nextName }
        await change(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'ID is not found'})

    });
    it('handles missing name in the body', async() => {
        req.body = {};
       await change(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name is missing'})
    });
    it('handles an empty name', async() => {
        req.body = {name: ''};
        await change(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name should not be empty'});
    });
    it('handles an empty name (after trimming)', async() => {
        req.body = {name: '     '};
        await change(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name should not be empty'});
    });
    it('handles wrong name type', async() => {
        req.body = {name: 69};
        await change(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'Name should be a string'});
    });
});

describe('delete', () => {
    it('works', async() => {
        const name = 'bububu';
        const todo = await createTodo(name, false);
        const { length } = await getTodos();
        req.params = { id: todo._id };

        await deleteTask(req as Request, res as Response);

        const todos = await getTodos();

        expect(res.json).toHaveBeenCalledTimes(1);
        expectResponse(todo);
        expect(todos).toHaveLength(length - 1);
    });
    it('handles missing body', async() => {
        req.params = { id: 'whatever' };
        await deleteTask(req as Request, res as Response);

        expectStatus(400);
        expectResponse({error: 'ID is not found'})

    });
});