import request from 'supertest';

import { app } from './app';
import { connect, disconnect, drop } from './client';

beforeAll(connect);
beforeEach(drop);
afterAll(disconnect);


it('works', async() => {
   const { status, header} = await request(app).get('/');

   expect(status).toEqual(200);
   expect(header['content-type']).toEqual('application/json; charset=utf-8')
})

it('updates a todo', async() => {
   const name = "Supper";
   const createResponse = await request(app).post('/').send({ name }).set('Content-Type', 'application/json')
   .set('Accept', 'application/json');

   expect(createResponse.status).toEqual(200);
   expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8');
   const createdTodo = JSON.parse(createResponse.text);
   expect(createdTodo).toMatchObject({ name, done: false });

   const { _id } = createdTodo;
   const nextName = "Dinner"

   const updateResponse = await request(app).put(`/${_id}`).send({ name: nextName });

   expect(updateResponse.status).toEqual(200);
   expect(updateResponse.header['content-type']).toEqual('application/json; charset=utf-8');
   const changedTodo = JSON.parse(updateResponse.text);
   expect(changedTodo).toMatchObject({ name: nextName, done: false })
   

});

it('deletes a todo', async() => {
   const name = "Supper";
   const createResponse = await request(app).post('/').send({ name }).set('Content-Type', 'application/json')
   .set('Accept', 'application/json');

   expect(createResponse.status).toEqual(200);
   expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8');
   const createdTodo = JSON.parse(createResponse.text);
   expect(createdTodo).toMatchObject({ name, done: false });

   const { _id } = createdTodo;

   const updateResponse = await request(app).delete(`/${_id}`).send();

   expect(updateResponse.status).toEqual(200);
   expect(updateResponse.header['content-type']).toEqual('application/json; charset=utf-8');
   const changedTodo = JSON.parse(updateResponse.text);
   expect(changedTodo).toMatchObject({ name, done: false })
   

});

it('returns an error when creating a todo without a body', async() => {
   const { status, header} = await request(app).post('/');

   expect(status).toEqual(400);
})

it('handles pages that are not found', async() => {
   const { status, text } = await request(app).get('/whatever');

   expect(status).toEqual(404);
   expect(text).toEqual("Not found");
})