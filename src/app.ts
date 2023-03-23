import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { add, change, deleteTask, list, toggle } from './todo';

export const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: ['http://localhost:3000', "https://mern-task-app-68dr.onrender.com"],
}))

app.set('x-powered-by', false); 

//  /get all
app.get('/', list);

//  /add
app.post('/', add);

//  /toggle
app.post('/toggle/:id', toggle);

//  /change
app.put('/:id', change);

//  /delete
app.delete('/:id', deleteTask);


app.get('*', (req: Request, res: Response) => {
    res.status(404).send('Not found');
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error.stack);
    res.status(500).send('We have encountered error and we were notified about it. We will try to fix it as soon as possible!');
})