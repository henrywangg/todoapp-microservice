import * as express from 'express'
import { Request, Response } from 'express'
import * as cors from 'cors'
import { createConnection } from 'typeorm'
import { Todo } from './entities/Todo'
import * as amqp from 'amqplib/callback_api'

createConnection().then((db) => {
    const todoRepository = db.getRepository(Todo)

    amqp.connect('amqps://qowqyodp:mOzoFwWruWw3Ja_x2-Tg7eGS5MIOsq6z@armadillo.rmq.cloudamqp.com/qowqyodp', (err0, conn) => {
        if (err0) 
            throw err0

        conn.createChannel((err1, channel) => {
            if (err1)
                throw err1

            const app = express();

            app.use(cors({
                origin: [
                    'http://localhost:3000',
                    'http://localhost:8080',
                    'http://localhost:4200'
                ]
            }))

            app.use(express.json())

            app.get('/api/todos', async (req: Request, res: Response) => {
                const todos = await todoRepository.find()
                res.json(todos)
            })

            app.post('/api/todos', async (req: Request, res: Response) => {
                const todo = todoRepository.create(req.body)
                const result = await todoRepository.save(todo)
                channel.sendToQueue('todo_created', Buffer.from(JSON.stringify(result)))
                res.send(result)
            })

            app.get('/api/todos/:id', async (req: Request, res: Response) => {
                const todo = await todoRepository.findOne({ where: { id: +req.params.id } })
                res.send(todo)
            })

            app.put('/api/todos/:id', async (req: Request, res: Response) => {
                const todo = await todoRepository.findOne({ where: { id: +req.params.id } })
                console.log(req.body)
                todoRepository.merge(todo, req.body)
                const result = await todoRepository.save(todo)
                channel.sendToQueue('todo_updated', Buffer.from(JSON.stringify(result)))
                res.send(result)
            })

            app.delete('/api/todos/:id', async (req: Request, res: Response) => {
                const result = await todoRepository.delete({ id: +req.params.id })
                channel.sendToQueue('todo_deleted', Buffer.from(req.params.id))
                res.send(result)
            })

            console.log('Listening to port: 8080')
            app.listen(8080)

            process.on('beforeExit', () => {
                console.log('closing')
                conn.close()
            })
        })
    })
})
